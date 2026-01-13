import { useState } from 'react';
import { 
  Award, 
  Briefcase, 
  Trophy, 
  Medal, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSkills, Skill, CreateSkillInput } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SkillsSectionProps {
  className?: string;
  readOnly?: boolean;
  userId?: string;
  showVerification?: boolean;
  onVerify?: (id: string, status: 'verified' | 'rejected', notes?: string) => Promise<boolean>;
}

const typeConfig = {
  certificate: { icon: Award, label: 'Certificate', color: 'bg-lavender text-lavender-foreground' },
  internship: { icon: Briefcase, label: 'Internship', color: 'bg-sky text-sky-foreground' },
  achievement: { icon: Trophy, label: 'Achievement', color: 'bg-peach text-peach-foreground' },
  extracurricular: { icon: Medal, label: 'Extra-curricular', color: 'bg-mint text-mint-foreground' },
};

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-muted text-muted-foreground' },
  verified: { icon: CheckCircle, label: 'Verified', color: 'bg-success/10 text-success' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'bg-danger/10 text-danger' },
};

export function SkillsSection({ 
  className, 
  readOnly = false, 
  userId,
  showVerification = false,
  onVerify
}: SkillsSectionProps) {
  const { skills, loading, addSkill, updateSkill, deleteSkill, verifySkill } = useSkills(userId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [verifyingSkill, setVerifyingSkill] = useState<Skill | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const [formData, setFormData] = useState<CreateSkillInput>({
    type: 'certificate',
    title: '',
    description: '',
    issuing_authority: '',
    category: '',
    url: '',
    date_obtained: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'certificate',
      title: '',
      description: '',
      issuing_authority: '',
      category: '',
      url: '',
      date_obtained: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (editingSkill) {
      const success = await updateSkill(editingSkill.id, formData);
      if (success) {
        toast.success('Skill updated successfully');
        setEditingSkill(null);
        resetForm();
      }
    } else {
      const skill = await addSkill(formData);
      if (skill) {
        toast.success('Skill added successfully');
        setIsAddDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteSkill(id);
    if (success) {
      toast.success('Skill deleted');
    }
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!verifyingSkill) return;

    const verifyFn = onVerify || verifySkill;
    const success = await verifyFn(verifyingSkill.id, status, verificationNotes);
    
    if (success) {
      toast.success(`Skill ${status}`);
      setVerifyingSkill(null);
      setVerificationNotes('');
    }
  };

  const openEdit = (skill: Skill) => {
    setFormData({
      type: skill.type,
      title: skill.title,
      description: skill.description || '',
      issuing_authority: skill.issuing_authority || '',
      category: skill.category || '',
      url: skill.url || '',
      date_obtained: skill.date_obtained || '',
    });
    setEditingSkill(skill);
  };

  if (loading) {
    return (
      <div className={cn("p-6 rounded-2xl bg-card soft-shadow animate-pulse", className)}>
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-2xl bg-card soft-shadow", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Skills & Achievements</h3>
        </div>
        
        {!readOnly && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v as Skill['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="w-4 h-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., AWS Cloud Practitioner"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your achievement"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Issuing Authority</label>
                    <Input
                      value={formData.issuing_authority}
                      onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Cloud Computing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date Obtained</label>
                    <Input
                      type="date"
                      value={formData.date_obtained}
                      onChange={(e) => setFormData({ ...formData, date_obtained: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">URL / Link</label>
                    <Input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Add Skill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {readOnly ? 'No skills added yet' : 'Add your first skill or achievement'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => {
            const TypeIcon = typeConfig[skill.type].icon;
            const StatusIcon = statusConfig[skill.verification_status].icon;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    typeConfig[skill.type].color
                  )}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground">{skill.title}</h4>
                        {skill.issuing_authority && (
                          <p className="text-sm text-muted-foreground">{skill.issuing_authority}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[skill.verification_status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[skill.verification_status].label}
                        </Badge>
                      </div>
                    </div>

                    {skill.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {skill.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      {skill.date_obtained && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(skill.date_obtained).toLocaleDateString()}
                        </span>
                      )}
                      {skill.category && (
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                      )}
                      {skill.url && (
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {!readOnly && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(skill)}
                            className="h-7 px-2 text-xs"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(skill.id)}
                            className="h-7 px-2 text-xs text-danger hover:text-danger"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                      
                      {showVerification && skill.verification_status === 'pending' && (
                        <Dialog open={verifyingSkill?.id === skill.id} onOpenChange={(open) => {
                          if (!open) {
                            setVerifyingSkill(null);
                            setVerificationNotes('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setVerifyingSkill(skill)}
                              className="h-7 px-2 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Verify Skill</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <p className="font-medium">{skill.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {skill.issuing_authority}
                                </p>
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingSkill} onOpenChange={(open) => {
        if (!open) {
          setEditingSkill(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as Skill['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Issuing Authority</label>
                <Input
                  value={formData.issuing_authority}
                  onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date Obtained</label>
                <Input
                  type="date"
                  value={formData.date_obtained}
                  onChange={(e) => setFormData({ ...formData, date_obtained: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL / Link</label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Update Skill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
