import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SliderQuestionProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function SliderQuestion({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 5,
  lowLabel = 'Low',
  highLabel = 'High',
  color = 'primary'
}: SliderQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <span className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          value <= 2 ? "bg-success/10 text-success" : 
          value <= 3 ? "bg-warning/10 text-warning" : 
          "bg-danger/10 text-danger"
        )}>
          {value}/{max}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={1}
        className="py-2"
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
