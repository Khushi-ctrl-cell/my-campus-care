import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PenLine, Send, CheckCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addWeeklyReflection, WeeklyReflection as WeeklyReflectionType } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

interface WeeklyReflectionProps {
  reflections: WeeklyReflectionType[];
  className?: string;
}

export function WeeklyReflection({ reflections, className }: WeeklyReflectionProps) {
  const [wentWell, setWentWell] = useState('');
  const [toImprove, setToImprove] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!wentWell.trim() || !toImprove.trim()) {
      toast({
        title: "Please fill both fields",
        description: "Share what went well and what to improve.",
        variant: "destructive",
      });
      return;
    }

    addWeeklyReflection(wentWell, toImprove);
    setSubmitted(true);
    toast({
      title: "Reflection Saved! 📝",
      description: "Great job reflecting on your week!",
    });
  };

  const handleReset = () => {
    setWentWell('');
    setToImprove('');
    setSubmitted(false);
  };

  return (
    <section className={cn("", className)}>
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground">
            Weekly Reflection
          </h2>
        </div>
        {reflections.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <History className="w-3 h-3" />
            {showHistory ? 'Hide' : 'View'} History
          </button>
        )}
      </div>

      {showHistory ? (
        <div className="space-y-3 animate-fade-in">
          {reflections.slice(-4).reverse().map((reflection, index) => (
            <div
              key={reflection.date}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="text-xs text-muted-foreground mb-2">
                {format(parseISO(reflection.date), 'MMM dd, yyyy')}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-success">What went well:</span>
                  <p className="text-sm text-foreground">{reflection.wentWell}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-warning">To improve:</span>
                  <p className="text-sm text-foreground">{reflection.toImprove}</p>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            className="w-full rounded-xl"
          >
            Back to Reflection
          </Button>
        </div>
      ) : !submitted ? (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-200/50 soft-shadow">
          <p className="text-sm text-muted-foreground mb-4">
            Take 1 minute to reflect on your week. This helps build self-awareness! 🌱
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                🌟 What went well this week?
              </label>
              <Textarea
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="E.g., Completed all DBMS assignments, attended all classes..."
                className="resize-none rounded-xl"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                🎯 One thing to improve next week?
              </label>
              <Textarea
                value={toImprove}
                onChange={(e) => setToImprove(e.target.value)}
                placeholder="E.g., Wake up earlier, start assignments sooner..."
                className="resize-none rounded-xl"
                rows={2}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 rounded-xl gap-2"
            >
              <Send className="w-4 h-4" />
              Save Reflection
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-mint border-2 border-success/30 text-center animate-scale-in">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success/20">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-bold text-mint-foreground mb-2">
            Reflection Saved! 📝
          </h3>
          <p className="text-sm text-mint-foreground/80 mb-4">
            Great job taking time to reflect. This builds self-awareness!
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-xl"
          >
            Add Another Reflection
          </Button>
        </div>
      )}
    </section>
  );
}
