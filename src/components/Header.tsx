import { GraduationCap, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, signOut } = useAuth();

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
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
          </Button>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.user_metadata?.full_name || 'Student'}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

export function DesktopHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="hidden lg:flex sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border h-16 items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
        </h1>
        <p className="text-sm text-muted-foreground">Here's your dashboard overview</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </Button>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.user_metadata?.full_name || 'Student'}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
