import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, BookOpen, TrendingUp, GraduationCap, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/checkin', icon: Heart, label: 'Check-In' },
  { path: '/tips', icon: BookOpen, label: 'Tips' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground leading-tight">
            GGCT Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Gyan Ganga College
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.user_metadata?.full_name || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
          <p className="text-sm font-medium text-foreground mb-1">Need Help?</p>
          <p className="text-xs text-muted-foreground">
            Reach out to your mentor or counsellor anytime.
          </p>
        </div>
      </div>
    </aside>
  );
}
