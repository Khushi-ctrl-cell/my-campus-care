import { GraduationCap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border lg:hidden">
      <div className="flex items-center justify-between h-16 px-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-foreground leading-tight">
              GGCT Student Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Gyan Ganga College of Technology
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </Button>
      </div>
    </header>
  );
}

export function DesktopHeader() {
  return (
    <header className="hidden lg:flex sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border h-16 items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-sm text-muted-foreground">Here's your dashboard overview</p>
      </div>
      
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
      </Button>
    </header>
  );
}
