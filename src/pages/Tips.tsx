import { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Phone, 
  Video,
  ChevronRight,
  GraduationCap,
  Clock,
  CheckSquare,
  Wind,
  Moon,
  Heart,
  Users,
  MessageCircle,
  HelpCircle,
  PlayCircle,
  FileText
} from 'lucide-react';
import { Header, DesktopHeader } from '@/components/Header';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface TipCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'sky' | 'lavender' | 'mint' | 'peach';
  tips: {
    icon: React.ElementType;
    title: string;
    content: string;
  }[];
}

const categories: TipCategory[] = [
  {
    id: 'academic',
    icon: BookOpen,
    title: 'Academic Tips',
    description: 'Strategies to excel in your studies',
    color: 'sky',
    tips: [
      {
        icon: GraduationCap,
        title: 'Getting Back on Track',
        content: 'Start with small, achievable goals. Break your syllabus into weekly chunks. Focus on understanding concepts rather than memorizing. Ask for help early — professors and seniors are here for you!',
      },
      {
        icon: Clock,
        title: 'Weekly & Semester Planning',
        content: 'Use a planner or digital calendar. Block study time like appointments. Review your schedule every Sunday. Include buffer time for unexpected tasks.',
      },
      {
        icon: CheckSquare,
        title: 'Revision Checklist',
        content: '1. Review notes within 24 hours of class\n2. Create summary sheets for each chapter\n3. Practice previous year questions\n4. Form study groups for difficult subjects\n5. Take regular breaks during long sessions',
      },
    ],
  },
  {
    id: 'wellbeing',
    icon: Brain,
    title: 'Well-Being Tools',
    description: 'Take care of your mental health',
    color: 'lavender',
    tips: [
      {
        icon: Wind,
        title: 'Quick Breathing Exercises',
        content: '4-7-8 Technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 3-4 times. This activates your parasympathetic nervous system and reduces anxiety.',
      },
      {
        icon: Moon,
        title: 'Sleep Hygiene Tips',
        content: '• Maintain consistent sleep/wake times\n• Avoid caffeine after 2 PM\n• Keep your room dark and cool\n• No screens 30 mins before bed\n• Aim for 7-8 hours of sleep',
      },
      {
        icon: Heart,
        title: 'Stress Management',
        content: 'Physical activity is a great stress reliever. Even a 15-minute walk helps. Practice gratitude — write 3 good things that happened today. Talk to friends or family when feeling overwhelmed.',
      },
    ],
  },
  {
    id: 'support',
    icon: Phone,
    title: 'Student Support',
    description: 'Resources and contacts for help',
    color: 'mint',
    tips: [
      {
        icon: Users,
        title: 'Mentor/Faculty Contact',
        content: 'Each department has dedicated faculty mentors. Visit your HOD office or check the college portal for your assigned mentor. They hold office hours for student consultations.',
      },
      {
        icon: MessageCircle,
        title: 'College Counselling',
        content: 'Free and confidential counselling is available at the Student Wellness Center. Located in Block B, Ground Floor. Walk-ins welcome Mon-Fri, 10 AM - 4 PM.',
      },
      {
        icon: HelpCircle,
        title: 'Helpline Numbers',
        content: '• GGCT Student Helpline: 0761-XXXXXXX\n• National Student Helpline: 1800-XXX-XXXX\n• iCall (Mental Health): 9152987821\n• Vandrevala Foundation: 1860-2662-345',
      },
    ],
  },
  {
    id: 'media',
    icon: Video,
    title: 'Handpicked Media',
    description: 'Videos and articles for growth',
    color: 'peach',
    tips: [
      {
        icon: PlayCircle,
        title: 'Study Skills Videos',
        content: 'Recommended YouTube Channels:\n• Thomas Frank (Study Tips)\n• Ali Abdaal (Productivity)\n• Crash Course (Subject Learning)\n• TED-Ed (Engaging Lessons)',
      },
      {
        icon: Clock,
        title: 'Time Management',
        content: 'Watch: "How to Manage Your Time Better" by Thomas Frank\nRead: "Atomic Habits" by James Clear\nTry: Forest app for focused study sessions',
      },
      {
        icon: FileText,
        title: 'Mindfulness Resources',
        content: 'Apps: Headspace, Calm, Insight Timer\nChannels: The Honest Guys, Michael Sealey\nPodcast: The Mindful Kind by Rachael Kable',
      },
    ],
  },
];

const colorStyles = {
  sky: {
    bg: 'bg-sky',
    text: 'text-sky-foreground',
    icon: 'bg-sky-foreground/10 text-sky-foreground',
    border: 'border-sky-foreground/20',
  },
  lavender: {
    bg: 'bg-lavender',
    text: 'text-lavender-foreground',
    icon: 'bg-lavender-foreground/10 text-lavender-foreground',
    border: 'border-lavender-foreground/20',
  },
  mint: {
    bg: 'bg-mint',
    text: 'text-mint-foreground',
    icon: 'bg-mint-foreground/10 text-mint-foreground',
    border: 'border-mint-foreground/20',
  },
  peach: {
    bg: 'bg-peach',
    text: 'text-peach-foreground',
    icon: 'bg-peach-foreground/10 text-peach-foreground',
    border: 'border-peach-foreground/20',
  },
};

export default function Tips() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header />
      <DesktopHeader />
      
      <main className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-mint">
            <BookOpen className="w-6 h-6 text-mint-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Tips & Resources</h1>
            <p className="text-sm text-muted-foreground">Helpful guides for your journey</p>
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const styles = colorStyles[category.color];
            const isExpanded = expandedCategory === category.id;

            return (
              <div
                key={category.id}
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in",
                  isExpanded && "lg:col-span-2"
                )}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 transition-all duration-300",
                    styles.bg,
                    isExpanded && "rounded-b-none"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    styles.icon
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className={cn("font-semibold", styles.text)}>
                      {category.title}
                    </h3>
                    <p className={cn("text-sm opacity-70", styles.text)}>
                      {category.description}
                    </p>
                  </div>
                  
                  <ChevronRight className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    styles.text,
                    isExpanded && "rotate-90"
                  )} />
                </button>

                {isExpanded && (
                  <div className={cn(
                    "p-4 border-2 border-t-0 rounded-b-2xl bg-card animate-fade-in",
                    styles.border
                  )}>
                    <div className="lg:grid lg:grid-cols-3 lg:gap-4">
                      <Accordion type="single" collapsible className="space-y-2 lg:contents">
                        {category.tips.map((tip, tipIndex) => {
                          const TipIcon = tip.icon;
                          return (
                            <AccordionItem
                              key={tipIndex}
                              value={`tip-${tipIndex}`}
                              className="border-0 lg:block"
                            >
                              <AccordionTrigger className="hover:no-underline p-3 rounded-xl bg-muted hover:bg-muted/80 lg:hidden">
                                <div className="flex items-center gap-3">
                                  <TipIcon className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-sm text-left">
                                    {tip.title}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-3 pt-3 lg:hidden">
                                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                  {tip.content}
                                </p>
                              </AccordionContent>
                              
                              {/* Desktop: Always visible cards */}
                              <div className="hidden lg:block p-4 rounded-xl bg-muted h-full">
                                <div className="flex items-center gap-3 mb-3">
                                  <TipIcon className="w-5 h-5 text-muted-foreground" />
                                  <span className="font-medium text-sm">
                                    {tip.title}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                  {tip.content}
                                </p>
                              </div>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
