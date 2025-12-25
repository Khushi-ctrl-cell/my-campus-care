import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing student data for risk prediction:", JSON.stringify(studentData));

    const systemPrompt = `You are an AI student risk assessment system for GGCT (Government Girls College of Technology). 
Analyze the student's academic data and predict their risk level.

Risk Level Criteria:
- LOW RISK: Attendance >= 75%, Average marks >= 60%, Pending assignments <= 2
- MEDIUM RISK: Attendance 60-74%, Average marks 40-59%, OR Pending assignments 3-5
- HIGH RISK: Attendance < 60%, Average marks < 40%, OR Pending assignments > 5

You must respond with ONLY a valid JSON object in this exact format:
{
  "riskLevel": "low" | "medium" | "high",
  "explanation": "Brief explanation of the risk assessment",
  "recommendations": ["recommendation1", "recommendation2"],
  "subjectRisks": [{"subject": "subject name", "risk": "low|medium|high", "reason": "why"}]
}`;

    const userPrompt = `Analyze this student's data and predict their risk level:

Student Name: ${studentData.name}
Course: ${studentData.course}
Semester: ${studentData.semester}

Subject Performance:
${studentData.subjects.map((s: any) => `- ${s.name}: Attendance ${s.attendance}%, Marks ${s.marks}%, Pending Assignments: ${s.pendingAssignments}`).join('\n')}

Overall Attendance: ${studentData.overallAttendance}%
Average Marks: ${studentData.averageMarks}%
Total Pending Assignments: ${studentData.totalPendingAssignments}

Well-being Data:
- Recent Mood: ${studentData.wellbeing?.mood || 'Not available'}
- Stress Level: ${studentData.wellbeing?.stress || 'Not available'}
- Sleep Quality: ${studentData.wellbeing?.sleep || 'Not available'}

Provide a risk assessment with specific recommendations for this student.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log("AI Response:", content);

    // Parse the JSON response
    let riskAssessment;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        riskAssessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to rule-based assessment
      riskAssessment = calculateFallbackRisk(studentData);
    }

    console.log("Risk assessment result:", JSON.stringify(riskAssessment));

    return new Response(JSON.stringify(riskAssessment), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in predict-risk function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      riskLevel: "medium",
      explanation: "Unable to analyze - using default assessment",
      recommendations: ["Please try again later"]
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function calculateFallbackRisk(studentData: any) {
  const attendance = studentData.overallAttendance || 75;
  const marks = studentData.averageMarks || 60;
  const pending = studentData.totalPendingAssignments || 0;

  let riskLevel = "low";
  let explanation = "Student is performing well academically.";
  const recommendations: string[] = [];

  if (attendance < 60 || marks < 40 || pending > 5) {
    riskLevel = "high";
    explanation = "Critical attention needed - multiple academic indicators are concerning.";
    if (attendance < 60) recommendations.push("Improve attendance immediately - attend all classes this week");
    if (marks < 40) recommendations.push("Schedule extra tutoring sessions for weak subjects");
    if (pending > 5) recommendations.push("Create a priority list and complete assignments one by one");
  } else if (attendance < 75 || marks < 60 || pending > 2) {
    riskLevel = "medium";
    explanation = "Some areas need attention to prevent falling behind.";
    if (attendance < 75) recommendations.push("Aim to attend 2-3 more classes this month");
    if (marks < 60) recommendations.push("Review study methods and seek help in challenging subjects");
    if (pending > 2) recommendations.push("Set deadlines to complete pending assignments this week");
  } else {
    recommendations.push("Keep up the good work!");
    recommendations.push("Consider helping peers who may need support");
  }

  return {
    riskLevel,
    explanation,
    recommendations,
    subjectRisks: studentData.subjects?.map((s: any) => ({
      subject: s.name,
      risk: s.attendance < 60 || s.marks < 40 ? "high" : s.attendance < 75 || s.marks < 60 ? "medium" : "low",
      reason: s.attendance < 75 ? "Low attendance" : s.marks < 60 ? "Low marks" : "Good performance"
    })) || []
  };
}
