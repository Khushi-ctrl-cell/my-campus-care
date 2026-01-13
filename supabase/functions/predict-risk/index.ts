import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema (manual validation since we can't import zod in edge functions)
interface SubjectData {
  name: string;
  attendance: number;
  marks: number;
  pendingAssignments: number;
}

interface WellbeingData {
  mood?: number;
  stress?: number;
  sleep?: number;
}

interface StudentData {
  name: string;
  course: string;
  semester: number;
  subjects: SubjectData[];
  overallAttendance: number;
  averageMarks: number;
  totalPendingAssignments: number;
  wellbeing?: WellbeingData;
}

function validateString(value: unknown, fieldName: string, maxLength: number = 100): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  if (value.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName} must be less than ${maxLength} characters`);
  }
  // Sanitize: remove potentially dangerous characters for prompt injection
  return value.replace(/[<>{}]/g, '').trim();
}

function validateNumber(value: unknown, fieldName: string, min: number = 0, max: number = 100): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a number`);
  }
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return value;
}

function validateStudentData(data: unknown): StudentData {
  if (!data || typeof data !== 'object') {
    throw new Error('Student data must be an object');
  }

  const obj = data as Record<string, unknown>;

  // Validate required fields
  const name = validateString(obj.name, 'name');
  const course = validateString(obj.course, 'course');
  const semester = validateNumber(obj.semester, 'semester', 1, 10);
  const overallAttendance = validateNumber(obj.overallAttendance, 'overallAttendance', 0, 100);
  const averageMarks = validateNumber(obj.averageMarks, 'averageMarks', 0, 100);
  const totalPendingAssignments = validateNumber(obj.totalPendingAssignments, 'totalPendingAssignments', 0, 50);

  // Validate subjects array
  if (!Array.isArray(obj.subjects)) {
    throw new Error('subjects must be an array');
  }
  if (obj.subjects.length > 20) {
    throw new Error('subjects array cannot exceed 20 items');
  }

  const subjects: SubjectData[] = obj.subjects.map((subject: unknown, index: number) => {
    if (!subject || typeof subject !== 'object') {
      throw new Error(`subjects[${index}] must be an object`);
    }
    const subj = subject as Record<string, unknown>;
    return {
      name: validateString(subj.name, `subjects[${index}].name`),
      attendance: validateNumber(subj.attendance, `subjects[${index}].attendance`, 0, 100),
      marks: validateNumber(subj.marks, `subjects[${index}].marks`, 0, 100),
      pendingAssignments: validateNumber(subj.pendingAssignments, `subjects[${index}].pendingAssignments`, 0, 50),
    };
  });

  // Validate optional wellbeing data
  let wellbeing: WellbeingData | undefined;
  if (obj.wellbeing && typeof obj.wellbeing === 'object') {
    const wb = obj.wellbeing as Record<string, unknown>;
    wellbeing = {
      mood: wb.mood !== undefined ? validateNumber(wb.mood, 'wellbeing.mood', 1, 5) : undefined,
      stress: wb.stress !== undefined ? validateNumber(wb.stress, 'wellbeing.stress', 1, 5) : undefined,
      sleep: wb.sleep !== undefined ? validateNumber(wb.sleep, 'wellbeing.sleep', 1, 5) : undefined,
    };
  }

  return {
    name,
    course,
    semester,
    subjects,
    overallAttendance,
    averageMarks,
    totalPendingAssignments,
    wellbeing,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized - missing authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate JWT using Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return new Response(JSON.stringify({ error: 'Unauthorized - invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!requestBody || typeof requestBody !== 'object') {
      return new Response(JSON.stringify({ error: 'Request body must be an object' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { studentData: rawStudentData } = requestBody as { studentData: unknown };

    // Validate student data
    let studentData: StudentData;
    try {
      studentData = validateStudentData(rawStudentData);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(JSON.stringify({ 
        error: `Validation error: ${validationError instanceof Error ? validationError.message : 'Invalid data'}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing student data for risk prediction (user:", userId, "):", JSON.stringify(studentData));

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
${studentData.subjects.map((s) => `- ${s.name}: Attendance ${s.attendance}%, Marks ${s.marks}%, Pending Assignments: ${s.pendingAssignments}`).join('\n')}

Overall Attendance: ${studentData.overallAttendance}%
Average Marks: ${studentData.averageMarks}%
Total Pending Assignments: ${studentData.totalPendingAssignments}

Well-being Data:
- Recent Mood: ${studentData.wellbeing?.mood !== undefined ? `${studentData.wellbeing.mood}/5` : 'Not available'}
- Stress Level: ${studentData.wellbeing?.stress !== undefined ? `${studentData.wellbeing.stress}/5` : 'Not available'}
- Sleep Quality: ${studentData.wellbeing?.sleep !== undefined ? `${studentData.wellbeing.sleep}/5` : 'Not available'}

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

function calculateFallbackRisk(studentData: StudentData) {
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
    subjectRisks: studentData.subjects?.map((s) => ({
      subject: s.name,
      risk: s.attendance < 60 || s.marks < 40 ? "high" : s.attendance < 75 || s.marks < 60 ? "medium" : "low",
      reason: s.attendance < 75 ? "Low attendance" : s.marks < 60 ? "Low marks" : "Good performance"
    })) || []
  };
}
