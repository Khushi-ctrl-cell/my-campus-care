import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, BookOpen, MessageCircle, X, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SilentHelpButtonProps {
  className?: string;
}

const helpOptions = [
  {
    id: 'academic',
    icon: BookOpen,
    title: 'Academic Help',
    description: 'Struggling with subjects or assignments',
    contacts: [
      { name: 'HOD Office', detail: 'Block A, Room 201' },
      { name: 'Academic Mentor', detail: 'Prof. Sharma - 9876543210' },
      { name: 'Library Help Desk', detail: 'Ground Floor, Block C' },
    ],
    color: 'bg-sky text-sky-foreground',
  },
  {
    id: 'emotional',
    icon: Heart,
    title: 'Emotional Support',
    description: 'Feeling overwhelmed or need someone to talk to',
    contacts: [
      { name: 'Student Counsellor', detail: 'Ms. Priya - Block B, GF' },
      { name: 'Wellness Center', detail: 'Mon-Fri, 10AM-4PM' },
      { name: 'iCall Helpline', detail: '9152987821 (Confidential)' },
    ],
    color: 'bg-lavender text-lavender-foreground',
  },
  {
    id: 'general',
    icon: MessageCircle,
    title: 'General Support',
    description: 'Other issues or just need guidance',
    contacts: [
      { name: 'Student Support Cell', detail: 'Block A, Room 105' },
      { name: 'Class Coordinator', detail: 'Check your section notice' },
      { name: 'GGCT Helpline', detail: '0761-XXXXXXX' },
    ],
    color: 'bg-mint text-mint-foreground',
  },
];

export function SilentHelpButton({ className }: SilentHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const selected = helpOptions.find(o => o.id === selectedOption);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-4 z-40 flex items-center justify-center lg:bottom-8 lg:right-8",
          "w-14 h-14 rounded-full bg-lavender shadow-lg",
          "transition-all duration-300 hover:scale-110",
          "animate-pulse-soft",
          className
        )}
        aria-label="Get quiet help"
      >
        <Heart className="w-6 h-6 text-lavender-foreground" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-lavender-foreground" />
              {selectedOption ? 'Contact Information' : 'How Can We Help?'}
            </DialogTitle>
          </DialogHeader>

          {!selectedOption ? (
            <div className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                This is a safe space. Choose the type of help you need. 
                No alerts, no exposure — just support. 💙
              </p>
              
              {helpOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-all text-left"
                  >
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl",
                      option.color
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {option.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <button
                onClick={() => setSelectedOption(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
                Back to options
              </button>
              
              {selected && (
                <>
                  <div className={cn(
                    "flex items-center gap-3 p-4 rounded-xl",
                    selected.color
                  )}>
                    <selected.icon className="w-6 h-6" />
                    <span className="font-semibold">{selected.title}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {selected.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-muted"
                      >
                        <div className="font-medium text-foreground">
                          {contact.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 rounded-xl bg-mint/50 border border-success/20">
                    <p className="text-sm text-mint-foreground">
                      💙 Remember: Asking for help is a sign of strength. 
                      You're not alone in this.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
