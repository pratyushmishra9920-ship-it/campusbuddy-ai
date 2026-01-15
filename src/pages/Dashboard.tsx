import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Calculator,
  Settings,
  Menu,
  X,
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import DashboardHome from '@/components/dashboard/DashboardHome';
import NotesSummarizer from '@/components/dashboard/NotesSummarizer';
import ImportantQuestions from '@/components/dashboard/ImportantQuestions';
import PracticalAssistant from '@/components/dashboard/PracticalAssistant';
import RevisionPlanner from '@/components/dashboard/RevisionPlanner';
import CGPATracker from '@/components/dashboard/CGPATracker';
import SettingsPage from '@/components/dashboard/SettingsPage';

const sidebarItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'notes', label: 'Notes Summarizer', icon: BookOpen },
  { id: 'questions', label: 'Important Questions', icon: HelpCircle },
  { id: 'practical', label: 'Practical Assistant', icon: FileText },
  { id: 'revision', label: 'Revision Planner', icon: Calendar },
  { id: 'cgpa', label: 'CGPA / Attendance', icon: Calculator },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome onNavigate={setActiveTab} />;
      case 'notes':
        return <NotesSummarizer />;
      case 'questions':
        return <ImportantQuestions />;
      case 'practical':
        return <PracticalAssistant />;
      case 'revision':
        return <RevisionPlanner />;
      case 'cgpa':
        return <CGPATracker />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">CampusBuddy</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                activeTab === item.id 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id && "text-primary"
              )} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Back to Landing */}
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <Link to="/">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold capitalize">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Demo Mode
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
