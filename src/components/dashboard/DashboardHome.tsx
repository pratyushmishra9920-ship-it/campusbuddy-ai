import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
}

interface RecentOutput {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  preview: string;
}

const DashboardHome = ({ onNavigate }: DashboardHomeProps) => {
  const [revisionPlan] = useLocalStorage<Array<{ completed: boolean }>>('campusbuddy-revision-plan', []);
  const [cgpaData] = useLocalStorage<Array<{ credits: number; grade: string }>>('campusbuddy-cgpa-data', []);
  const [attendanceData] = useLocalStorage<Array<{ subject: string; attendance: number }>>('campusbuddy-attendance-data', []);
  const [recentOutputs] = useLocalStorage<RecentOutput[]>('campusbuddy-recent-outputs', []);

  // Calculate stats
  const revisionProgress = revisionPlan.length > 0 
    ? Math.round((revisionPlan.filter(day => day.completed).length / revisionPlan.length) * 100)
    : 0;

  const lowAttendance = attendanceData.filter(s => s.attendance < 75);
  
  const calculateCGPA = () => {
    if (cgpaData.length === 0) return 0;
    const gradePoints: Record<string, number> = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
    let totalCredits = 0;
    let totalPoints = 0;
    cgpaData.forEach(s => {
      const gp = gradePoints[s.grade] ?? 0;
      totalCredits += s.credits;
      totalPoints += s.credits * gp;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const quickActions = [
    { id: 'notes', icon: BookOpen, label: 'Summarize Notes', color: 'from-blue-500 to-cyan-500' },
    { id: 'questions', icon: HelpCircle, label: 'Generate Questions', color: 'from-purple-500 to-pink-500' },
    { id: 'practical', icon: FileText, label: 'Build Practical File', color: 'from-orange-500 to-red-500' },
    { id: 'revision', icon: Calendar, label: 'Create Revision Plan', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">Demo Prototype</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CampusBuddy AI!</h1>
          <p className="text-muted-foreground max-w-xl">
            Your AI-powered student assistant. Use the tools below to summarize notes, generate questions, plan revision, and more.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="glass-card rounded-xl p-4 sm:p-5 text-left hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="font-medium text-sm sm:text-base">{action.label}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revision Progress */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium">Revision Progress</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('revision')}>
              View
            </Button>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold">{revisionProgress}%</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${revisionProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {revisionPlan.length > 0 
                ? `${revisionPlan.filter(d => d.completed).length} of ${revisionPlan.length} days completed`
                : 'No revision plan created yet'}
            </p>
          </div>
        </div>

        {/* Attendance Warning */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${lowAttendance.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
              <span className="font-medium">Attendance Alert</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('cgpa')}>
              View
            </Button>
          </div>
          {lowAttendance.length > 0 ? (
            <div className="space-y-2">
              <p className="text-yellow-500 font-medium">{lowAttendance.length} subject(s) below 75%</p>
              {lowAttendance.slice(0, 2).map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[120px]">{s.subject}</span>
                  <span className="text-yellow-500">{s.attendance}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-green-500 font-medium">All good! 👍</p>
              <p className="text-sm text-muted-foreground">
                {attendanceData.length > 0 ? 'All subjects above 75%' : 'Add subjects to track attendance'}
              </p>
            </div>
          )}
        </div>

        {/* CGPA Summary */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium">CGPA Summary</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('cgpa')}>
              View
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text">{calculateCGPA() || '—'}</div>
            <p className="text-sm text-muted-foreground">
              {cgpaData.length > 0 
                ? `Based on ${cgpaData.length} subject(s)`
                : 'Add subjects to calculate CGPA'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Outputs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Outputs</h2>
        {recentOutputs.length > 0 ? (
          <div className="space-y-3">
            {recentOutputs.slice(0, 5).map((output) => (
              <div key={output.id} className="glass-card rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {output.type === 'summary' && <BookOpen className="w-5 h-5 text-primary" />}
                  {output.type === 'questions' && <HelpCircle className="w-5 h-5 text-purple-500" />}
                  {output.type === 'practical' && <FileText className="w-5 h-5 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{output.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{output.preview}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(output.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No outputs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start using the tools to generate summaries, questions, and more!
            </p>
            <Button variant="gradient" onClick={() => onNavigate('notes')}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
