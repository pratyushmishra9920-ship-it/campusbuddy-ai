import { useState, useEffect } from 'react';
import { Calendar, Beaker, Sparkles, Check, Download, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateRevisionPlan } from '@/lib/generators';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface PlanDay {
  date: string;
  tasks: string[];
  completed: boolean;
}

const RevisionPlanner = () => {
  const [examDate, setExamDate] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [plan, setPlan] = useLocalStorage<PlanDay[]>('campusbuddy-revision-plan', []);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestData = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    setExamDate(futureDate.toISOString().split('T')[0]);
    setTopics([
      'Arrays and Strings',
      'Linked Lists',
      'Stacks and Queues',
      'Trees and Binary Trees',
      'Graphs',
      'Sorting Algorithms',
      'Searching Algorithms',
      'Dynamic Programming',
      'Greedy Algorithms',
      'Hashing',
    ]);
    toast.success('Test data loaded!');
  };

  const addTopic = () => {
    if (!newTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    if (topics.includes(newTopic.trim())) {
      toast.error('Topic already added');
      return;
    }
    setTopics([...topics, newTopic.trim()]);
    setNewTopic('');
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (!examDate) {
      toast.error('Please select exam date');
      return;
    }
    if (topics.length === 0) {
      toast.error('Please add at least one topic');
      return;
    }
    
    const exam = new Date(examDate);
    const today = new Date();
    if (exam <= today) {
      toast.error('Exam date must be in the future');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = generateRevisionPlan(exam, topics);
      setPlan(result);
      setIsLoading(false);
      toast.success('Revision plan created!');
    }, 600);
  };

  const toggleDayComplete = (index: number) => {
    setPlan(prev => prev.map((day, i) => 
      i === index ? { ...day, completed: !day.completed } : day
    ));
  };

  const clearPlan = () => {
    setPlan([]);
    toast.success('Plan cleared!');
  };

  const exportPlan = () => {
    const text = `REVISION PLAN\nExam Date: ${examDate}\n${'='.repeat(50)}\n\n` +
      plan.map((day, i) => 
        `Day ${i + 1} (${format(new Date(day.date), 'EEE, MMM d')})\n` +
        `Status: ${day.completed ? '✅ Completed' : '⏳ Pending'}\n` +
        `Tasks:\n${day.tasks.map(t => `  • ${t}`).join('\n')}\n`
      ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revision-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Plan exported!');
  };

  const progress = plan.length > 0 
    ? Math.round((plan.filter(d => d.completed).length / plan.length) * 100)
    : 0;

  const daysUntilExam = examDate 
    ? differenceInDays(new Date(examDate), new Date())
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Revision Planner</h1>
            <p className="text-sm text-muted-foreground">Create a day-wise study schedule</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleTestData}>
          <Beaker className="w-4 h-4 mr-2" />
          Test Data
        </Button>
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Exam Date</label>
            <Input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-muted/50 border-border"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Add Topic</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Arrays"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                className="bg-muted/50 border-border"
              />
              <Button variant="secondary" onClick={addTopic}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Topics List */}
        {topics.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Topics ({topics.length})</label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm group"
                >
                  {topic}
                  <button
                    onClick={() => removeTopic(i)}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <Button variant="gradient" onClick={handleGenerate} disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Plan
        </Button>
      </div>

      {/* Plan Output */}
      {plan.length > 0 && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h2 className="font-semibold">Your Revision Plan</h2>
              <p className="text-sm text-muted-foreground">
                {daysUntilExam > 0 ? `${daysUntilExam} days until exam` : 'Exam day!'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={exportPlan}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearPlan}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.filter(d => d.completed).length} of {plan.length} days completed
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {plan.map((day, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-xl border transition-all ${
                  day.completed 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleDayComplete(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      day.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {day.completed ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${day.completed ? 'line-through text-muted-foreground' : ''}`}>
                        Day {index + 1} — {format(new Date(day.date), 'EEEE, MMM d')}
                      </h3>
                      {day.completed && (
                        <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {day.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className={`text-sm ${day.completed ? 'text-muted-foreground' : ''}`}>
                          • {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionPlanner;
