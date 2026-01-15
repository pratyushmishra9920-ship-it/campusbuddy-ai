// Deterministic generators for all modules when AI is not available

export function generateSummary(notes: string, subject: string): string {
  const lines = notes.split('\n').filter(line => line.trim());
  const keyPoints: string[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length > 10) {
      // Shorten long lines
      const shortened = trimmed.length > 100 ? trimmed.slice(0, 100) + '...' : trimmed;
      keyPoints.push(shortened);
    }
  });

  const summary = `## ${subject} - Summary\n\n` +
    `This summary covers the key concepts from your notes:\n\n` +
    keyPoints.slice(0, 8).map((point, i) => `${i + 1}. ${point}`).join('\n') +
    `\n\n**Key Takeaways:**\n` +
    `- Focus on understanding core concepts\n` +
    `- Practice numerical problems if applicable\n` +
    `- Review diagrams and flowcharts`;

  return summary;
}

export function generateKeyPoints(notes: string): string[] {
  const lines = notes.split('\n').filter(line => line.trim().length > 15);
  const points: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Extract potential key points
    if (trimmed.includes(':') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
      points.push(trimmed.replace(/^[-•]\s*/, ''));
    } else if (trimmed.length > 20 && trimmed.length < 150) {
      points.push(trimmed);
    }
  });

  if (points.length < 5) {
    return [
      'Review the main definitions and terminology',
      'Understand the underlying principles',
      'Practice application-based problems',
      'Create mind maps for better retention',
      'Focus on exam-relevant topics',
    ];
  }

  return points.slice(0, 10);
}

export function generateMCQs(notes: string, subject: string): Array<{ question: string; options: string[]; answer: string }> {
  const topics = extractTopics(notes);
  
  const mcqs = topics.slice(0, 5).map((topic, index) => ({
    question: `Which of the following best describes ${topic}?`,
    options: [
      `A fundamental concept in ${subject}`,
      `A derived principle from ${topic}`,
      `An application of ${topic} theory`,
      `None of the above`,
    ],
    answer: 'A fundamental concept in ' + subject,
  }));

  if (mcqs.length < 3) {
    return [
      {
        question: `What is the primary focus of ${subject}?`,
        options: ['Theoretical concepts', 'Practical applications', 'Both A and B', 'Neither'],
        answer: 'Both A and B',
      },
      {
        question: `Which approach is most effective for studying ${subject}?`,
        options: ['Memorization only', 'Understanding concepts', 'Practice problems', 'All of the above'],
        answer: 'All of the above',
      },
      {
        question: `${subject} is commonly applied in which field?`,
        options: ['Engineering', 'Research', 'Industry', 'All domains'],
        answer: 'All domains',
      },
    ];
  }

  return mcqs;
}

export function generateQuestions(subject: string, topic: string, difficulty: string): Array<{ question: string; important: boolean }> {
  const difficultyPrefix = difficulty === 'Easy' ? 'Define' : difficulty === 'Medium' ? 'Explain' : 'Analyze';
  
  const baseQuestions = [
    { question: `${difficultyPrefix} the concept of ${topic} in ${subject}.`, important: true },
    { question: `What are the key principles of ${topic}?`, important: true },
    { question: `Describe the applications of ${topic} in real-world scenarios.`, important: true },
    { question: `Compare and contrast ${topic} with related concepts.`, important: true },
    { question: `What are the advantages and disadvantages of ${topic}?`, important: true },
    { question: `Explain the mathematical formulation of ${topic} if applicable.`, important: false },
    { question: `Discuss the historical development of ${topic}.`, important: false },
    { question: `What are the common misconceptions about ${topic}?`, important: false },
    { question: `How does ${topic} relate to other topics in ${subject}?`, important: false },
    { question: `Explain the significance of ${topic} in modern applications.`, important: false },
    { question: `What are the numerical problems related to ${topic}?`, important: false },
    { question: `Describe the experimental setup for ${topic} if applicable.`, important: false },
    { question: `What are the recent advancements in ${topic}?`, important: false },
    { question: `Explain the theoretical background of ${topic}.`, important: false },
    { question: `What are the challenges in implementing ${topic}?`, important: false },
  ];

  return baseQuestions;
}

export function generatePracticalFile(title: string, context: string): {
  aim: string;
  apparatus: string[];
  theory: string;
  procedure: string[];
  observation: string;
  result: string;
  vivaQuestions: string[];
} {
  return {
    aim: `To study and implement ${title} and understand its working principles${context ? ` in the context of ${context}` : ''}.`,
    apparatus: [
      'Computer system with required software',
      'Laboratory equipment as per experiment',
      'Measurement instruments',
      'Safety equipment',
      'Documentation materials',
    ],
    theory: `${title} is a fundamental concept in engineering that involves understanding the underlying principles and their practical applications. This experiment aims to provide hands-on experience with ${title}, helping students bridge the gap between theoretical knowledge and practical implementation.\n\nThe theoretical foundation includes understanding the core concepts, mathematical formulations, and the relationship between various parameters involved in ${title}.`,
    procedure: [
      'Set up the required apparatus and equipment as per the experiment guidelines.',
      'Ensure all safety protocols are followed before starting the experiment.',
      'Initialize the system and verify all connections.',
      'Take initial readings and document the baseline parameters.',
      'Perform the main experiment following the standard methodology.',
      'Record all observations systematically in the observation table.',
      'Repeat the experiment for multiple trials to ensure accuracy.',
      'Analyze the collected data and calculate required values.',
      'Compare results with theoretical values and note any deviations.',
      'Draw conclusions based on the experimental findings.',
    ],
    observation: `| S.No | Parameter 1 | Parameter 2 | Calculated Value | Theoretical Value |\n|------|-------------|-------------|------------------|-------------------|\n| 1 | - | - | - | - |\n| 2 | - | - | - | - |\n| 3 | - | - | - | - |\n| 4 | - | - | - | - |\n| 5 | - | - | - | - |`,
    result: `The experiment on ${title} was successfully conducted. The observations and calculations demonstrate the practical application of theoretical concepts. The experimental results are in accordance with the expected theoretical values, with acceptable deviation within experimental error limits.`,
    vivaQuestions: [
      `What is the principle behind ${title}?`,
      `Explain the significance of each component used in this experiment.`,
      `What precautions should be taken during this experiment?`,
      `How would you improve the accuracy of this experiment?`,
      `What are the real-world applications of ${title}?`,
      `Explain the mathematical formulation used in this experiment.`,
      `What are the sources of error in this experiment?`,
      `How does temperature affect the results of this experiment?`,
      `Compare this method with alternative approaches.`,
      `What are the safety considerations for this experiment?`,
    ],
  };
}

export function generateRevisionPlan(examDate: Date, topics: string[]): Array<{ date: string; tasks: string[]; completed: boolean }> {
  const today = new Date();
  const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExam <= 0) return [];
  
  const plan: Array<{ date: string; tasks: string[]; completed: boolean }> = [];
  const topicsPerDay = Math.ceil(topics.length / Math.max(daysUntilExam - 1, 1));
  
  let topicIndex = 0;
  
  for (let i = 0; i < daysUntilExam && topicIndex < topics.length; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dayTasks: string[] = [];
    
    for (let j = 0; j < topicsPerDay && topicIndex < topics.length; j++) {
      dayTasks.push(`Study: ${topics[topicIndex]}`);
      topicIndex++;
    }
    
    if (i > 0 && i % 3 === 0) {
      dayTasks.push('Revision: Review previous topics');
    }
    
    if (i === daysUntilExam - 1) {
      dayTasks.push('Final revision and rest');
    }
    
    plan.push({
      date: date.toISOString().split('T')[0],
      tasks: dayTasks,
      completed: false,
    });
  }
  
  return plan;
}

function extractTopics(notes: string): string[] {
  const lines = notes.split('\n').filter(line => line.trim());
  const topics: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Look for headings or key terms
    if (trimmed.match(/^#+\s/) || trimmed.match(/^[A-Z][a-z]+:/) || trimmed.length < 50) {
      const cleaned = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
      if (cleaned.length > 3 && cleaned.length < 50) {
        topics.push(cleaned);
      }
    }
  });
  
  return topics.length > 0 ? topics : ['Main Topic', 'Subtopic 1', 'Subtopic 2'];
}

export const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
};

export function calculateCGPA(subjects: Array<{ credits: number; grade: string }>): number {
  if (subjects.length === 0) return 0;
  
  let totalCredits = 0;
  let totalPoints = 0;
  
  subjects.forEach(subject => {
    const gradePoint = GRADE_POINTS[subject.grade] ?? 0;
    totalCredits += subject.credits;
    totalPoints += subject.credits * gradePoint;
  });
  
  if (totalCredits === 0) return 0;
  
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}
