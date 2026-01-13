import { useState } from 'react';
import { Users, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ERPStudent, calculateERPRiskLevel, parseCIEMarks } from '@/integrations/erp';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ERPStudentsListProps {
  students: ERPStudent[];
  className?: string;
}

const statusConfig = {
  Regular: { color: 'bg-success text-success-foreground' },
  'Low Attendance': { color: 'bg-warning text-warning-foreground' },
  Detained: { color: 'bg-danger text-danger-foreground' },
};

const riskConfig = {
  low: { color: 'bg-mint text-mint-foreground', icon: CheckCircle },
  medium: { color: 'bg-peach text-peach-foreground', icon: AlertTriangle },
  high: { color: 'bg-danger/10 text-danger', icon: AlertTriangle },
};

export function ERPStudentsList({ students, className }: ERPStudentsListProps) {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const branches = [...new Set(students.map(s => s.branch))];
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'all' || student.branch === branchFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const atRiskCount = students.filter(s => s.status !== 'Regular').length;

  return (
    <div className={cn("rounded-2xl bg-card soft-shadow overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">ERP Students</h3>
              <p className="text-xs text-muted-foreground">
                {students.length} students • {atRiskCount} at risk
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
              <SelectItem value="Low Attendance">Low Attendance</SelectItem>
              <SelectItem value="Detained">Detained</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
              <TableHead className="text-center">CIE Marks</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const riskLevel = calculateERPRiskLevel(student);
                const RiskIcon = riskConfig[riskLevel].icon;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-xs">{student.roll_no}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.branch}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "font-medium",
                        student.attendance < 75 ? "text-danger" : 
                        student.attendance < 85 ? "text-warning" : "text-success"
                      )}>
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {student.cie_marks} ({parseCIEMarks(student.cie_marks)}%)
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={statusConfig[student.status].color}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        riskConfig[riskLevel].color
                      )}>
                        <RiskIcon className="w-3 h-3" />
                        {riskLevel}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
