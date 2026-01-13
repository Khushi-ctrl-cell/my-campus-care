import { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  ChevronRight,
  User
} from 'lucide-react';
import { Header, DesktopHeader } from '@/components/Header';
import { RoleGuard } from '@/components/RoleGuard';
import { SkillsSection } from '@/components/SkillsSection';
import { useMentorAssignments } from '@/hooks/useMentorAssignments';
import { useSkills } from '@/hooks/useSkills';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function MentorPanelContent() {
  const { user } = useAuth();
  const { assignments, loading: assignmentsLoading } = useMentorAssignments(user?.id);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredAssignments = assignments.filter(a => 
    a.student_profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.student_profile?.roll_number?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalStudents: assignments.length,
    recentFeedback: 0,
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header />
      <DesktopHeader />
      
      <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-lavender">
            <GraduationCap className="w-6 h-6 text-lavender-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mentor Panel</h1>
            <p className="text-sm text-muted-foreground">Guide and support your assigned students</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-sky soft-shadow">
            <Users className="w-5 h-5 text-sky-foreground mb-2" />
            <p className="text-2xl font-bold text-sky-foreground">{stats.totalStudents}</p>
            <p className="text-xs text-sky-foreground/80">Assigned Students</p>
          </div>
          <div className="p-4 rounded-2xl bg-mint soft-shadow">
            <MessageSquare className="w-5 h-5 text-mint-foreground mb-2" />
            <p className="text-2xl font-bold text-mint-foreground">{stats.recentFeedback}</p>
            <p className="text-xs text-mint-foreground/80">Pending Reviews</p>
          </div>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="skills">Review Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            {/* Search */}
            <div className="p-4 rounded-2xl bg-card soft-shadow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-3">
              {assignmentsLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading students...
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="p-8 rounded-2xl bg-card soft-shadow text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Students Assigned</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact an admin to get students assigned to you.
                  </p>
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 rounded-2xl bg-card soft-shadow hover:border-primary/30 border border-transparent transition-colors cursor-pointer"
                    onClick={() => setSelectedStudentId(assignment.student_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {assignment.student_profile?.full_name || 'Unnamed Student'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.student_profile?.roll_number || 'No roll number'}
                          {assignment.student_profile?.course && ` • ${assignment.student_profile.course}`}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsSection 
              readOnly 
              showVerification
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Student Details Dialog */}
      <Dialog 
        open={!!selectedStudentId} 
        onOpenChange={(open) => !open && setSelectedStudentId(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <SkillsSection 
              userId={selectedStudentId || undefined}
              readOnly
              showVerification
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MentorPanel() {
  return (
    <RoleGuard allowedRoles={['mentor', 'admin', 'super_admin']}>
      <MentorPanelContent />
    </RoleGuard>
  );
}
