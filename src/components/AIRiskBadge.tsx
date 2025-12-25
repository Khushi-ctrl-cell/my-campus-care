import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Brain, RefreshCw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRiskPrediction, RiskAssessment } from '@/hooks/useRiskPrediction';
import { Button } from '@/components/ui/button';

interface AIRiskBadgeProps {
  className?: string;
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    label: 'Low Risk',
    bgClass: 'bg-mint',
    textClass: 'text-mint-foreground',
    iconClass: 'text-success',
    borderClass: 'border-success/30',
  },
  medium: {
    icon: Shield,
    label: 'Medium Risk',
    bgClass: 'bg-peach',
    textClass: 'text-peach-foreground',
    iconClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  high: {
    icon: AlertTriangle,
    label: 'High Risk',
    bgClass: 'bg-danger/10',
    textClass: 'text-danger',
    iconClass: 'text-danger',
    borderClass: 'border-danger/30',
  },
};

export function AIRiskBadge({ className }: AIRiskBadgeProps) {
  const { predictRisk, assessment, isLoading, error } = useRiskPrediction();
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    predictRisk();
  }, [predictRisk]);

  if (isLoading) {
    return (
      <div className={cn(
        "p-4 rounded-2xl border-2 bg-card border-border animate-pulse",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                AI Analyzing...
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Predicting risk level using AI model
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className={cn(
        "p-4 rounded-2xl border-2 bg-card border-border",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted">
              <Brain className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Risk Analysis</p>
              <p className="text-xs text-muted-foreground">
                {error || 'Click to analyze your risk'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => predictRisk()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze
          </Button>
        </div>
      </div>
    );
  }

  const config = riskConfig[assessment.riskLevel];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 animate-fade-in stagger-1",
      config.bgClass,
      config.borderClass,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          assessment.riskLevel === 'low' ? 'bg-success/20' : 
          assessment.riskLevel === 'medium' ? 'bg-warning/20' : 'bg-danger/20'
        )}>
          <Icon className={cn("w-6 h-6", config.iconClass)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              assessment.riskLevel === 'low' ? 'bg-success text-success-foreground' : 
              assessment.riskLevel === 'medium' ? 'bg-warning text-warning-foreground' : 
              'bg-danger text-danger-foreground'
            )}>
              {config.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary flex items-center gap-1">
              <Brain className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className={cn("text-sm font-medium leading-relaxed", config.textClass)}>
            {assessment.explanation}
          </p>
          
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Lightbulb className="w-3 h-3" />
                {showRecommendations ? 'Hide' : 'Show'} AI Recommendations
              </button>
              
              {showRecommendations && (
                <ul className="mt-2 space-y-1">
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => predictRisk()}
          className="shrink-0"
          title="Refresh prediction"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </div>
    </div>
  );
}
