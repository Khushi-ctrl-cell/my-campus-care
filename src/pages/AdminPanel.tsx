import { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus,
  Award, 
  Search,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Header, DesktopHeader } from '@/components/Header';
import { RoleGuard } from '@/components/RoleGuard';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useSkills, Skill } from '@/hooks/useSkills';
import { useMentorAssignments } from '@/hooks/useMentorAssignments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-muted text-muted-foreground' },
  verified: { icon: CheckCircle, color: 'bg-success/10 text-success' },
  rejected: { icon: XCircle, color: 'bg-danger/10 text-danger' },
};

function AdminPanelContent() {
  const { users, loading: usersLoading } = useAllUsers();
  const { skills, loading: skillsLoading, verifySkill, refetch: refetchSkills } = useSkills();
  const { assignments, assignStudent, removeAssignment } = useMentorAssignments();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const students = users.filter(u => u.roles.includes('student'));
  const mentors = users.filter(u => u.roles.includes('mentor'));

  const filteredSkills = skills.filter(skill => {
    const matchesStatus = statusFilter === 'all' || skill.verification_status === statusFilter;
    const matchesSearch = skill.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalStudents: students.length,
    totalMentors: mentors.length,
    pendingSkills: skills.filter(s => s.verification_status === 'pending').length,
    verifiedSkills: skills.filter(s => s.verification_status === 'verified').length,
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!selectedSkill) return;

    const success = await verifySkill(selectedSkill.id, status, verificationNotes);
    if (success) {
      toast.success(`Skill ${status}`);
      setSelectedSkill(null);
      setVerificationNotes('');
      refetchSkills();
    }
  };

  const handleAssignMentor = async () => {
    if (!selectedMentor || !selectedStudent) {
      toast.error('Please select both mentor and student');
      return;
    }

    const success = await assignStudent(selectedMentor, selectedStudent);
    if (success) {
      toast.success('Student assigned to mentor');
      setAssignmentDialogOpen(false);
      setSelectedMentor('');
      setSelectedStudent('');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header />
      <DesktopHeader />
      
      <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-peach">
            <ShieldCheck className="w-6 h-6 text-peach-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage students, verify skills, assign mentors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-sky soft-shadow">
            <Users className="w-5 h-5 text-sky-foreground mb-2" />
            <p className="text-2xl font-bold text-sky-foreground">{stats.totalStudents}</p>
            <p className="text-xs text-sky-foreground/80">Students</p>
          </div>
          <div className="p-4 rounded-2xl bg-lavender soft-shadow">
            <Users className="w-5 h-5 text-lavender-foreground mb-2" />
            <p className="text-2xl font-bold text-lavender-foreground">{stats.totalMentors}</p>
            <p className="text-xs text-lavender-foreground/80">Mentors</p>
          </div>
          <div className="p-4 rounded-2xl bg-peach soft-shadow">
            <Clock className="w-5 h-5 text-peach-foreground mb-2" />
            <p className="text-2xl font-bold text-peach-foreground">{stats.pendingSkills}</p>
            <p className="text-xs text-peach-foreground/80">Pending Skills</p>
          </div>
          <div className="p-4 rounded-2xl bg-mint soft-shadow">
            <CheckCircle className="w-5 h-5 text-mint-foreground mb-2" />
            <p className="text-2xl font-bold text-mint-foreground">{stats.verifiedSkills}</p>
            <p className="text-xs text-mint-foreground/80">Verified</p>
          </div>
        </div>

        <Tabs defaultValue="skills" className="space-y-4">
          <TabsList>
            <TabsTrigger value="skills">Skill Verification</TabsTrigger>
            <TabsTrigger value="assignments">Mentor Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-card soft-shadow">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills Table */}
            <div className="rounded-2xl bg-card soft-shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading skills...
                      </TableCell>
                    </TableRow>
                  ) : filteredSkills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No skills found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSkills.map((skill) => {
                      const StatusIcon = statusConfig[skill.verification_status].icon;
                      return (
                        <TableRow key={skill.id}>
                          <TableCell className="font-medium">{skill.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{skill.type}</Badge>
                          </TableCell>
                          <TableCell>{skill.issuing_authority || '-'}</TableCell>
                          <TableCell>
                            <Badge className={statusConfig[skill.verification_status].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {skill.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {skill.verification_status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSkill(skill)}
                              >
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAssignmentDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Student to Mentor
              </Button>
            </div>

            <div className="rounded-2xl bg-card soft-shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Assigned On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No assignments yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          {assignment.mentor_profile?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {assignment.student_profile?.full_name || 'Unknown'}
                          {assignment.student_profile?.roll_number && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({assignment.student_profile.roll_number})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger hover:text-danger"
                            onClick={() => removeAssignment(assignment.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Verify Skill Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium">{selectedSkill?.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedSkill?.issuing_authority}</p>
              {selectedSkill?.description && (
                <p className="text-sm mt-2">{selectedSkill.description}</p>
              )}
              {selectedSkill?.url && (
                <a
                  href={selectedSkill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 block"
                >
                  View Certificate →
                </a>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
              <Textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add verification notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-danger border-danger hover:bg-danger/10"
                onClick={() => handleVerify('rejected')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-success/90"
                onClick={() => handleVerify('verified')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Student to Mentor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select Mentor</label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.user_id} value={mentor.user_id}>
                      {mentor.full_name || 'Unnamed Mentor'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.user_id} value={student.user_id}>
                      {student.full_name || 'Unnamed Student'}
                      {student.roll_number && ` (${student.roll_number})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAssignMentor} className="w-full">
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <AdminPanelContent />
    </RoleGuard>
  );
}
