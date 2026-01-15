import { useState } from 'react';
import { HelpCircle, Copy, Download, Beaker, Sparkles, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateQuestions } from '@/lib/generators';
import { toast } from 'sonner';

interface RecentOutput {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  preview: string;
  content: string;
}

const ImportantQuestions = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState<Array<{ question: string; important: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [recentOutputs, setRecentOutputs] = useLocalStorage<RecentOutput[]>('campusbuddy-recent-outputs', []);

  const handleTestData = () => {
    setSubject('Operating Systems');
    setTopic('Process Synchronization');
    setDifficulty('Medium');
    toast.success('Test data loaded!');
  };

  const handleGenerate = () => {
    if (!subject.trim() || !topic.trim()) {
      toast.error('Please enter subject and topic');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = generateQuestions(subject, topic, difficulty);
      setQuestions(result);
      setIsLoading(false);
      
      // Save to recent outputs
      const output: RecentOutput = {
        id: Date.now().toString(),
        type: 'questions',
        title: `${subject} - ${topic} Questions`,
        timestamp: new Date().toISOString(),
        preview: result[0]?.question || '',
        content: result.map((q, i) => `${i + 1}. ${q.question}${q.important ? ' ⭐' : ''}`).join('\n'),
      };
      setRecentOutputs(prev => [output, ...prev.slice(0, 19)]);
      toast.success('Questions generated!');
    }, 800);
  };

  const copyToClipboard = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q.question}${q.important ? ' [IMPORTANT]' : ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const text = `Important Questions: ${subject} - ${topic}\nDifficulty: ${difficulty}\n${'='.repeat(50)}\n\n` +
      questions.map((q, i) => `${i + 1}. ${q.question}${q.important ? ' [IMPORTANT]' : ''}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject}-${topic}-questions.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Important Questions</h1>
            <p className="text-sm text-muted-foreground">Get exam-focused questions instantly</p>
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
            <label className="block text-sm font-medium mb-2">Subject</label>
            <Input
              placeholder="e.g., Operating Systems"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit / Topic</label>
            <Input
              placeholder="e.g., Process Synchronization"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty Level</label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="gradient" onClick={handleGenerate} disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Questions
        </Button>
      </div>

      {/* Output Section */}
      {questions.length > 0 && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="font-semibold">Generated Questions</h2>
              <p className="text-sm text-muted-foreground">
                {questions.filter(q => q.important).length} marked as most important
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadAsText}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${
                    q.important 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                      q.important 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{q.question}</p>
                      {q.important && (
                        <div className="flex items-center gap-1 mt-2 text-primary text-sm">
                          <Star className="w-4 h-4 fill-primary" />
                          Most Important
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportantQuestions;
