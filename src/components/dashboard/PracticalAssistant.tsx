import { useState } from 'react';
import { FileText, Copy, Download, Beaker, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generatePracticalFile } from '@/lib/generators';
import { toast } from 'sonner';

interface RecentOutput {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  preview: string;
  content: string;
}

interface PracticalOutput {
  aim: string;
  apparatus: string[];
  theory: string;
  procedure: string[];
  observation: string;
  result: string;
  vivaQuestions: string[];
}

const PracticalAssistant = () => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState<PracticalOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [recentOutputs, setRecentOutputs] = useLocalStorage<RecentOutput[]>('campusbuddy-recent-outputs', []);

  const handleTestData = () => {
    setTitle('Implementation of Stack using Array');
    setContext('Data Structures Lab, CSE');
    toast.success('Test data loaded!');
  };

  const handleGenerate = () => {
    if (!title.trim()) {
      toast.error('Please enter experiment title');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = generatePracticalFile(title, context);
      setOutput(result);
      setIsLoading(false);
      
      // Save to recent outputs
      const outputText = formatOutput(result);
      const recentOutput: RecentOutput = {
        id: Date.now().toString(),
        type: 'practical',
        title: `Practical: ${title}`,
        timestamp: new Date().toISOString(),
        preview: result.aim.slice(0, 100) + '...',
        content: outputText,
      };
      setRecentOutputs(prev => [recentOutput, ...prev.slice(0, 19)]);
      toast.success('Practical file generated!');
    }, 900);
  };

  const formatOutput = (data: PracticalOutput): string => {
    return `PRACTICAL FILE
${'='.repeat(50)}

EXPERIMENT: ${title}
${context ? `CONTEXT: ${context}` : ''}

${'='.repeat(50)}

AIM:
${data.aim}

APPARATUS REQUIRED:
${data.apparatus.map((a, i) => `${i + 1}. ${a}`).join('\n')}

THEORY:
${data.theory}

PROCEDURE:
${data.procedure.map((p, i) => `Step ${i + 1}: ${p}`).join('\n')}

OBSERVATION TABLE:
${data.observation}

RESULT:
${data.result}

VIVA QUESTIONS:
${data.vivaQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(formatOutput(output));
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    if (!output) return;
    const text = formatOutput(output);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practical-${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Practical Assistant</h1>
            <p className="text-sm text-muted-foreground">Generate complete practical file formats</p>
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
          <label className="block text-sm font-medium mb-2">Experiment Title</label>
          <Input
            placeholder="e.g., Implementation of Stack using Array"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-muted/50 border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Branch / Lab Context (Optional)</label>
          <Textarea
            placeholder="e.g., Data Structures Lab, CSE 3rd Semester"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-[80px] bg-muted/50 border-border resize-y"
          />
        </div>
        <Button variant="gradient" onClick={handleGenerate} disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Practical File
        </Button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="font-semibold">Generated Practical File</h2>
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
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Aim */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Aim</h3>
                <p className="bg-muted/30 p-4 rounded-xl">{output.aim}</p>
              </div>

              {/* Apparatus */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Apparatus Required</h3>
                <ul className="bg-muted/30 p-4 rounded-xl space-y-1">
                  {output.apparatus.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-primary/20 text-primary text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Theory */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Theory</h3>
                <div className="bg-muted/30 p-4 rounded-xl whitespace-pre-wrap">{output.theory}</div>
              </div>

              {/* Procedure */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Procedure</h3>
                <ol className="bg-muted/30 p-4 rounded-xl space-y-2">
                  {output.procedure.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Observation Table */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Observation Table</h3>
                <div className="bg-muted/30 p-4 rounded-xl overflow-x-auto">
                  <pre className="text-sm font-mono">{output.observation}</pre>
                </div>
              </div>

              {/* Result */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Result</h3>
                <p className="bg-muted/30 p-4 rounded-xl">{output.result}</p>
              </div>

              {/* Viva Questions */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Viva Questions</h3>
                <ol className="bg-muted/30 p-4 rounded-xl space-y-2">
                  {output.vivaQuestions.map((question, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded bg-secondary/30 text-secondary text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticalAssistant;
