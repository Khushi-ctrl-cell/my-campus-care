import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Focus, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubjectData, addFocusSession } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface FocusModeProps {
  subjects: SubjectData[];
  className?: string;
}

const durations = [
  { value: 25, label: '25 min' },
  { value: 40, label: '40 min' },
  { value: 60, label: '60 min' },
];

export function FocusMode({ subjects, className }: FocusModeProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.code || '');
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, timeLeft]);

  const handleStart = () => {
    setTimeLeft(selectedDuration * 60);
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedDuration * 60);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    addFocusSession(selectedSubject, selectedDuration);
    toast({
      title: "Focus Session Complete! 🌱",
      description: `Great work on ${selectedSubject}! One focused session done.`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isActive ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0;

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-2 px-1 mb-3">
        <Focus className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Focus Mode - Study Booster
        </h2>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-200/50 soft-shadow">
        {!isActive && !isCompleted ? (
          <>
            {/* Subject Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Choose Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.code)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      selectedSubject === subject.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                  >
                    {subject.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Session Duration
              </label>
              <div className="flex gap-2">
                {durations.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => {
                      setSelectedDuration(dur.value);
                      setTimeLeft(dur.value * 60);
                    }}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      selectedDuration === dur.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              className="w-full h-14 text-base font-semibold rounded-xl gap-2"
            >
              <Play className="w-5 h-5" />
              Start Focus Session
            </Button>
          </>
        ) : isCompleted ? (
          <div className="text-center py-6 animate-scale-in">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-success/20">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Nice work! 🌱
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              One focused session on {selectedSubject} complete!
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              className="rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Another Session
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            {/* Timer Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * progress) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary mb-2 animate-pulse-soft" />
                <div className="text-4xl font-bold text-foreground">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedSubject}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handlePauseResume}
                variant="outline"
                size="lg"
                className="rounded-xl"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="lg"
                className="rounded-xl"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Calm Message */}
            <p className="text-xs text-muted-foreground mt-6">
              Stay focused. You're doing great. 💙
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
