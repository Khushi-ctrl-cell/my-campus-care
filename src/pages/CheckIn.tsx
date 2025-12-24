import { useState, useEffect } from 'react';
import { Heart, Send, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { EmojiSelector } from '@/components/EmojiSelector';
import { SliderQuestion } from '@/components/SliderQuestion';
import { WellBeingTips } from '@/components/WellBeingTips';
import { Button } from '@/components/ui/button';
import { addWellBeingRecord, getStudentData, WellBeingRecord } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moodEmojis = ['😢', '🙁', '😐', '🙂', '😁'];
const moodLabels = ['Bad', 'Low', 'Okay', 'Good', 'Great'];

const sleepEmojis = ['😴', '🥱', '😪', '😊', '✨'];
const sleepLabels = ['Poor', 'Fair', 'Okay', 'Good', 'Excellent'];

const motivationEmojis = ['😩', '😕', '🤔', '😌', '🔥'];
const motivationLabels = ['None', 'Low', 'Some', 'Good', 'High'];

export default function CheckIn() {
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [lastRecord, setLastRecord] = useState<Omit<WellBeingRecord, 'date'> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const data = getStudentData();
    const today = new Date().toISOString().split('T')[0];
    const todaysRecord = data.wellBeing.find(r => r.date === today);
    
    if (todaysRecord) {
      setMood(todaysRecord.mood);
      setStress(todaysRecord.stress);
      setSleep(todaysRecord.sleep);
      setMotivation(todaysRecord.motivation);
      setLastRecord(todaysRecord);
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = () => {
    const record = { mood, stress, sleep, motivation };
    addWellBeingRecord(record);
    setLastRecord(record);
    setSubmitted(true);
    
    toast({
      title: "Check-in Saved! 💙",
      description: "Thanks for checking in. Here are some tips based on how you're feeling.",
    });
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-lavender">
            <Heart className="w-6 h-6 text-lavender-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Well-Being Check-In</h1>
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6 animate-fade-in">
            {/* Mood */}
            <div className="p-5 rounded-2xl bg-card soft-shadow">
              <EmojiSelector
                label="How's your mood today?"
                value={mood}
                onChange={setMood}
                emojis={moodEmojis}
                labels={moodLabels}
              />
            </div>

            {/* Stress */}
            <div className="p-5 rounded-2xl bg-card soft-shadow">
              <SliderQuestion
                label="Stress Level"
                value={stress}
                onChange={setStress}
                lowLabel="Relaxed"
                highLabel="Very Stressed"
              />
            </div>

            {/* Sleep */}
            <div className="p-5 rounded-2xl bg-card soft-shadow">
              <EmojiSelector
                label="How did you sleep last night?"
                value={sleep}
                onChange={setSleep}
                emojis={sleepEmojis}
                labels={sleepLabels}
              />
            </div>

            {/* Motivation */}
            <div className="p-5 rounded-2xl bg-card soft-shadow">
              <EmojiSelector
                label="Motivation level for today"
                value={motivation}
                onChange={setMotivation}
                emojis={motivationEmojis}
                labels={motivationLabels}
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              className="w-full h-14 text-base font-semibold rounded-xl gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Check-In
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className={cn(
              "p-6 rounded-2xl bg-mint border-2 border-success/30 text-center animate-scale-in"
            )}>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success/20">
                <Sparkles className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-lg font-bold text-mint-foreground mb-2">
                Thanks for checking in! 💙
              </h2>
              <p className="text-sm text-mint-foreground/80">
                {mood >= 4 && stress <= 2
                  ? "You seem to be in a great state! Keep it up!"
                  : "Here are some gentle tips to help you today."}
              </p>
            </div>

            {/* Tips */}
            {lastRecord && <WellBeingTips record={lastRecord} />}

            {/* Update Button */}
            <Button 
              onClick={handleReset}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Update My Check-In
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
