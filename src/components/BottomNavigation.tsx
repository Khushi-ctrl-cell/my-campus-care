import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/checkin', icon: Heart, label: 'Check-In' },
  { path: '/tips', icon: BookOpen, label: 'Tips' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 px-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive && "scale-110"
                )} />
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-scale-in" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-300",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
