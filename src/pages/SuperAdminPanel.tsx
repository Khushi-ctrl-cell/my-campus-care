import { useState } from 'react';
import { 
  Shield, 
  Users, 
  UserCog, 
  Award, 
  BarChart3, 
  Settings,
  Search,
  Plus,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Header, DesktopHeader } from '@/components/Header';
import { RoleGuard } from '@/components/RoleGuard';
import { useAllUsers, UserWithRole } from '@/hooks/useAllUsers';
import { useSkills } from '@/hooks/useSkills';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  student: 'bg-sky text-sky-foreground',
  mentor: 'bg-lavender text-lavender-foreground',
  counsellor: 'bg-mint text-mint-foreground',
  admin: 'bg-peach text-peach-foreground',
  super_admin: 'bg-primary text-primary-foreground',
};

function SuperAdminPanelContent() {
  const { users, loading, assignRole, removeRole, refetch } = useAllUsers();
  const { skills } = useSkills();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.roll_number?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.roles.includes('student')).length,
    mentors: users.filter(u => u.roles.includes('mentor')).length,
    admins: users.filter(u => u.roles.includes('admin') || u.roles.includes('super_admin')).length,
    pendingSkills: skills.filter(s => s.verification_status === 'pending').length,
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole) return;

    const success = await assignRole(selectedUser.user_id, newRole as any);
    if (success) {
      toast.success(`Role ${newRole} assigned to ${selectedUser.full_name || 'User'}`);
      setNewRole('');
      setSelectedUser(null);
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    const success = await removeRole(userId, role as any);
    if (success) {
      toast.success('Role removed');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header />
      <DesktopHeader />
      
      <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Super Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage users, roles, and platform settings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-card soft-shadow">
            <Users className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="p-4 rounded-2xl bg-sky soft-shadow">
            <Users className="w-5 h-5 text-sky-foreground mb-2" />
            <p className="text-2xl font-bold text-sky-foreground">{stats.students}</p>
            <p className="text-xs text-sky-foreground/80">Students</p>
          </div>
          <div className="p-4 rounded-2xl bg-lavender soft-shadow">
            <UserCog className="w-5 h-5 text-lavender-foreground mb-2" />
            <p className="text-2xl font-bold text-lavender-foreground">{stats.mentors}</p>
            <p className="text-xs text-lavender-foreground/80">Mentors</p>
          </div>
          <div className="p-4 rounded-2xl bg-peach soft-shadow">
            <Shield className="w-5 h-5 text-peach-foreground mb-2" />
            <p className="text-2xl font-bold text-peach-foreground">{stats.admins}</p>
            <p className="text-xs text-peach-foreground/80">Admins</p>
          </div>
          <div className="p-4 rounded-2xl bg-mint soft-shadow">
            <Award className="w-5 h-5 text-mint-foreground mb-2" />
            <p className="text-2xl font-bold text-mint-foreground">{stats.pendingSkills}</p>
            <p className="text-xs text-mint-foreground/80">Pending Skills</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-card soft-shadow">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="mentor">Mentors</SelectItem>
                  <SelectItem value="counsellor">Counsellors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="super_admin">Super Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-card soft-shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'Unnamed User'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {user.roll_number || '-'}
                        </TableCell>
                        <TableCell>{user.course || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge 
                                key={role} 
                                className={cn("text-xs", roleColors[role])}
                              >
                                {role}
                                {role !== 'student' && (
                                  <button
                                    onClick={() => handleRemoveRole(user.user_id, role)}
                                    className="ml-1 hover:text-danger"
                                  >
                                    ×
                                  </button>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="p-8 rounded-2xl bg-card soft-shadow text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Detailed analytics and reports will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Assign Role Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to {selectedUser?.full_name || 'User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Current roles: {selectedUser?.roles.join(', ')}
              </p>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignRole} className="w-full" disabled={!newRole}>
              Assign Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SuperAdminPanel() {
  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <SuperAdminPanelContent />
    </RoleGuard>
  );
}
