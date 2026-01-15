import { useState } from 'react';
import { BookOpen, Copy, Download, Beaker, Sparkles, Check, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateSummary, generateKeyPoints, generateMCQs } from '@/lib/generators';
import { toast } from 'sonner';

interface RecentOutput {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  preview: string;
  content: string;
}

const NotesSummarizer = () => {
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [mcqs, setMcqs] = useState<Array<{ question: string; options: string[]; answer: string }>>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints' | 'mcqs'>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [recentOutputs, setRecentOutputs] = useLocalStorage<RecentOutput[]>('campusbuddy-recent-outputs', []);

  const handleTestData = () => {
    setSubject('Data Structures');
    setNotes(`# Arrays and Linked Lists

## Arrays
Arrays are contiguous memory locations used to store similar data types. They offer O(1) access time for random access.

Key characteristics:
- Fixed size (in most languages)
- Elements stored in contiguous memory
- Direct access using index
- Cache-friendly due to locality

## Linked Lists
A linked list is a linear data structure where elements are stored in nodes, with each node pointing to the next.

Types:
- Singly Linked List: Each node points to next
- Doubly Linked List: Nodes point to both next and previous
- Circular Linked List: Last node points to first

Operations:
- Insertion: O(1) at head, O(n) at tail (for singly linked)
- Deletion: O(1) if node reference available
- Search: O(n) always

Comparison:
Arrays are better for random access, linked lists for frequent insertions/deletions.`);
    toast.success('Test data loaded!');
  };

  const handleSummarize = () => {
    if (!subject.trim() || !notes.trim()) {
      toast.error('Please enter subject and notes');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = generateSummary(notes, subject);
      setSummary(result);
      setActiveTab('summary');
      setIsLoading(false);
      
      // Save to recent outputs
      const output: RecentOutput = {
        id: Date.now().toString(),
        type: 'summary',
        title: `${subject} Summary`,
        timestamp: new Date().toISOString(),
        preview: result.slice(0, 100) + '...',
        content: result,
      };
      setRecentOutputs(prev => [output, ...prev.slice(0, 19)]);
      toast.success('Summary generated!');
    }, 800);
  };

  const handleKeyPoints = () => {
    if (!notes.trim()) {
      toast.error('Please enter notes');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = generateKeyPoints(notes);
      setKeyPoints(result);
      setActiveTab('keypoints');
      setIsLoading(false);
      toast.success('Key points extracted!');
    }, 600);
  };

  const handleMCQs = () => {
    if (!subject.trim() || !notes.trim()) {
      toast.error('Please enter subject and notes');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = generateMCQs(notes, subject);
      setMcqs(result);
      setActiveTab('mcqs');
      setIsLoading(false);
      toast.success('MCQs generated!');
    }, 700);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const getOutputContent = () => {
    if (activeTab === 'summary') return summary;
    if (activeTab === 'keypoints') return keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
    if (activeTab === 'mcqs') return mcqs.map((q, i) => `Q${i + 1}. ${q.question}\n${q.options.map((o, j) => `   ${String.fromCharCode(65 + j)}) ${o}`).join('\n')}\n   Answer: ${q.answer}`).join('\n\n');
    return '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Notes Summarizer</h1>
            <p className="text-sm text-muted-foreground">Turn messy notes into clean summaries</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleTestData}>
          <Beaker className="w-4 h-4 mr-2" />
          Test Data
        </Button>
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <Input
            placeholder="e.g., Data Structures, Operating Systems"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-muted/50 border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Notes</label>
          <Textarea
            placeholder="Paste your notes here... Supports markdown formatting."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px] bg-muted/50 border-border resize-y"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="gradient" onClick={handleSummarize} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Summarize
          </Button>
          <Button variant="secondary" onClick={handleKeyPoints} disabled={isLoading}>
            <ListChecks className="w-4 h-4 mr-2" />
            Extract Key Points
          </Button>
          <Button variant="secondary" onClick={handleMCQs} disabled={isLoading}>
            <BookOpen className="w-4 h-4 mr-2" />
            Generate MCQs
          </Button>
        </div>
      </div>

      {/* Output Section */}
      {(summary || keyPoints.length > 0 || mcqs.length > 0) && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-4">
            <Button
              variant={activeTab === 'summary' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('summary')}
              disabled={!summary}
            >
              Summary
            </Button>
            <Button
              variant={activeTab === 'keypoints' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('keypoints')}
              disabled={keyPoints.length === 0}
            >
              Key Points
            </Button>
            <Button
              variant={activeTab === 'mcqs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('mcqs')}
              disabled={mcqs.length === 0}
            >
              MCQs
            </Button>
          </div>

          {/* Content */}
          <div className="min-h-[200px]">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                {activeTab === 'summary' && summary && (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-foreground bg-transparent p-0 font-sans">
                      {summary}
                    </pre>
                  </div>
                )}
                {activeTab === 'keypoints' && keyPoints.length > 0 && (
                  <ul className="space-y-2">
                    {keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'mcqs' && mcqs.length > 0 && (
                  <div className="space-y-6">
                    {mcqs.map((mcq, i) => (
                      <div key={i} className="p-4 bg-muted/30 rounded-xl">
                        <p className="font-medium mb-3">Q{i + 1}. {mcq.question}</p>
                        <div className="space-y-2 mb-3">
                          {mcq.options.map((opt, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm">
                              <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs">
                                {String.fromCharCode(65 + j)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-primary">Answer: {mcq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => copyToClipboard(getOutputContent())}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="secondary" onClick={() => downloadAsText(getOutputContent(), `${subject || 'notes'}-${activeTab}.txt`)}>
              <Download className="w-4 h-4 mr-2" />
              Download .txt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSummarizer;
