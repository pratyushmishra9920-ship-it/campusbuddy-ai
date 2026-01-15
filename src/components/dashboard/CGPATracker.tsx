import { useState } from 'react';
import { Calculator, Beaker, Plus, X, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GRADE_POINTS, calculateCGPA } from '@/lib/generators';
import { toast } from 'sonner';

interface CGPASubject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface AttendanceSubject {
  id: string;
  subject: string;
  attendance: number;
}

const grades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];

const CGPATracker = () => {
  const [cgpaSubjects, setCgpaSubjects] = useLocalStorage<CGPASubject[]>('campusbuddy-cgpa-data', []);
  const [attendanceData, setAttendanceData] = useLocalStorage<AttendanceSubject[]>('campusbuddy-attendance-data', []);
  const [activeTab, setActiveTab] = useState<'cgpa' | 'attendance'>('cgpa');

  // New subject form
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newCredits, setNewCredits] = useState('');
  const [newGrade, setNewGrade] = useState('');
  
  // New attendance form
  const [newAttSubject, setNewAttSubject] = useState('');
  const [newAttPercentage, setNewAttPercentage] = useState('');

  const handleTestData = () => {
    const testCGPA: CGPASubject[] = [
      { id: '1', name: 'Data Structures', credits: 4, grade: 'A+' },
      { id: '2', name: 'Operating Systems', credits: 3, grade: 'A' },
      { id: '3', name: 'Database Management', credits: 3, grade: 'O' },
      { id: '4', name: 'Computer Networks', credits: 3, grade: 'B+' },
      { id: '5', name: 'Software Engineering', credits: 3, grade: 'A' },
    ];
    const testAttendance: AttendanceSubject[] = [
      { id: '1', subject: 'Data Structures', attendance: 85 },
      { id: '2', subject: 'Operating Systems', attendance: 72 },
      { id: '3', subject: 'Database Management', attendance: 90 },
      { id: '4', subject: 'Computer Networks', attendance: 68 },
      { id: '5', subject: 'Software Engineering', attendance: 78 },
    ];
    setCgpaSubjects(testCGPA);
    setAttendanceData(testAttendance);
    toast.success('Test data loaded!');
  };

  const addCGPASubject = () => {
    if (!newSubjectName.trim() || !newCredits || !newGrade) {
      toast.error('Please fill all fields');
      return;
    }
    const credits = parseInt(newCredits);
    if (isNaN(credits) || credits <= 0) {
      toast.error('Credits must be a positive number');
      return;
    }
    const subject: CGPASubject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      credits,
      grade: newGrade,
    };
    setCgpaSubjects([...cgpaSubjects, subject]);
    setNewSubjectName('');
    setNewCredits('');
    setNewGrade('');
    toast.success('Subject added!');
  };

  const removeCGPASubject = (id: string) => {
    setCgpaSubjects(cgpaSubjects.filter(s => s.id !== id));
  };

  const addAttendanceSubject = () => {
    if (!newAttSubject.trim() || !newAttPercentage) {
      toast.error('Please fill all fields');
      return;
    }
    const attendance = parseFloat(newAttPercentage);
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      toast.error('Attendance must be between 0 and 100');
      return;
    }
    const subject: AttendanceSubject = {
      id: Date.now().toString(),
      subject: newAttSubject.trim(),
      attendance,
    };
    setAttendanceData([...attendanceData, subject]);
    setNewAttSubject('');
    setNewAttPercentage('');
    toast.success('Subject added!');
  };

  const removeAttendanceSubject = (id: string) => {
    setAttendanceData(attendanceData.filter(s => s.id !== id));
  };

  const cgpa = calculateCGPA(cgpaSubjects);
  const totalCredits = cgpaSubjects.reduce((sum, s) => sum + s.credits, 0);
  const lowAttendance = attendanceData.filter(s => s.attendance < 75);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CGPA & Attendance</h1>
            <p className="text-sm text-muted-foreground">Track your academic performance</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleTestData}>
          <Beaker className="w-4 h-4 mr-2" />
          Test Data
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
        <Button
          variant={activeTab === 'cgpa' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('cgpa')}
          className="rounded-lg"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          CGPA Calculator
        </Button>
        <Button
          variant={activeTab === 'attendance' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('attendance')}
          className="rounded-lg"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Attendance
        </Button>
      </div>

      {activeTab === 'cgpa' && (
        <>
          {/* CGPA Summary Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Your CGPA</p>
                <p className="text-4xl font-bold gradient-text">{cgpa || '—'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                <p className="text-4xl font-bold">{totalCredits}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Subjects</p>
                <p className="text-4xl font-bold">{cgpaSubjects.length}</p>
              </div>
            </div>
          </div>

          {/* Add Subject Form */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold">Add Subject</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <Input
                placeholder="Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <Input
                type="number"
                placeholder="Credits"
                value={newCredits}
                onChange={(e) => setNewCredits(e.target.value)}
                className="bg-muted/50 border-border"
                min="1"
              />
              <Select value={newGrade} onValueChange={setNewGrade}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade} ({GRADE_POINTS[grade]} points)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="gradient" onClick={addCGPASubject}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Subjects List */}
          {cgpaSubjects.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Your Subjects</h3>
              <div className="space-y-3">
                {cgpaSubjects.map(subject => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {subject.grade}
                      </span>
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.credits} credits • {GRADE_POINTS[subject.grade]} grade points
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCGPASubject(subject.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grade Points Reference */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Grade Points Reference</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Object.entries(GRADE_POINTS).map(([grade, points]) => (
                <div key={grade} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="font-bold text-primary">{grade}</p>
                  <p className="text-sm text-muted-foreground">{points}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'attendance' && (
        <>
          {/* Attendance Warning Card */}
          {lowAttendance.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-500">Attendance Warning</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {lowAttendance.length} subject(s) have attendance below 75%
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lowAttendance.map(s => (
                      <span key={s.id} className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-sm">
                        {s.subject}: {s.attendance}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Attendance Form */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold">Add Subject Attendance</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                placeholder="Subject Name"
                value={newAttSubject}
                onChange={(e) => setNewAttSubject(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <Input
                type="number"
                placeholder="Attendance %"
                value={newAttPercentage}
                onChange={(e) => setNewAttPercentage(e.target.value)}
                className="bg-muted/50 border-border"
                min="0"
                max="100"
              />
              <Button variant="gradient" onClick={addAttendanceSubject}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Attendance List */}
          {attendanceData.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Attendance Tracker</h3>
              <div className="space-y-4">
                {attendanceData.map(subject => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${
                          subject.attendance >= 75 ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {subject.attendance}%
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttendanceSubject(subject.id)}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          subject.attendance >= 75 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CGPATracker;
