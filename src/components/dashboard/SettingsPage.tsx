import { Settings, Trash2, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAllAppData, exportAllAppData } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const SettingsPage = () => {
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      clearAllAppData();
      toast.success('All data cleared!');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = exportAllAppData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusbuddy-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your app data and preferences</p>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Data Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your saved data as a JSON file
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={handleExportData}>
              Export
            </Button>
          </div>

          <div className="flex items-start justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Delete all saved data including revision plans, CGPA, and outputs
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleClearData}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">About</h2>
        
        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">CampusBuddy AI — Demo Prototype</p>
            <p className="text-sm text-muted-foreground mt-1">
              This is a fully functional demo prototype showcasing what a student AI assistant can do. 
              All features work end-to-end with local data storage.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">React</span>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">TypeScript</span>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Tailwind CSS</span>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">localStorage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Version 1.0.0 • Made with ❤️ for students</p>
      </div>
    </div>
  );
};

export default SettingsPage;
