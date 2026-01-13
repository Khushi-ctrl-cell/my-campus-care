import { Bell, Calendar, AlertCircle, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ERPNotice } from '@/integrations/erp';

interface NoticesCardProps {
  notices: ERPNotice[];
  className?: string;
}

const typeConfig = {
  general: { icon: Bell, color: 'text-primary', bg: 'bg-primary/10' },
  exam: { icon: Calendar, color: 'text-warning', bg: 'bg-warning/10' },
  assignment: { icon: BookOpen, color: 'text-lavender-foreground', bg: 'bg-lavender' },
  event: { icon: Sparkles, color: 'text-success', bg: 'bg-success/10' },
};

const priorityColors = {
  low: 'border-l-muted-foreground',
  medium: 'border-l-warning',
  high: 'border-l-danger',
};

export function NoticesCard({ notices, className }: NoticesCardProps) {
  if (notices.length === 0) {
    return (
      <div className={cn(
        "p-4 rounded-2xl bg-card soft-shadow",
        className
      )}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Notices</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          No notices at the moment
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-2xl bg-card soft-shadow",
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Notices</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {notices.length} active
        </span>
      </div>

      <div className="space-y-3">
        {notices.slice(0, 4).map((notice) => {
          const config = typeConfig[notice.type] || typeConfig.general;
          const Icon = config.icon;

          return (
            <div
              key={notice.id}
              className={cn(
                "p-3 rounded-xl bg-muted/50 border-l-4",
                priorityColors[notice.priority]
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-1.5 rounded-lg", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notice.content}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
