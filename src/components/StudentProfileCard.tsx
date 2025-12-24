import { User } from 'lucide-react';
import { StudentProfile } from '@/lib/store';
import { cn } from '@/lib/utils';

interface StudentProfileCardProps {
  profile: StudentProfile;
  className?: string;
}

export function StudentProfileCard({ profile, className }: StudentProfileCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-card soft-shadow animate-fade-in",
      className
    )}>
      <div className="relative">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary overflow-hidden flex items-center justify-center">
          {profile.photo ? (
            <img 
              src={profile.photo} 
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-success-foreground" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-foreground truncate">
          {profile.name}
        </h2>
        <p className="text-sm text-primary font-medium">
          {profile.course}
        </p>
        <p className="text-xs text-muted-foreground">
          Semester {profile.semester} • Section {profile.section}
        </p>
      </div>
    </div>
  );
}
