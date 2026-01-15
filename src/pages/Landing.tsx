import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Calculator,
  ChevronRight,
  Sparkles,
  Zap,
  Users,
  Star,
  ArrowRight,
  Check,
  GraduationCap,
  Brain,
  Target,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Notes Summarizer',
    description: 'Turn messy notes into clean, organized bullet points in seconds.',
  },
  {
    icon: HelpCircle,
    title: 'Important Questions',
    description: 'Get exam-focused questions with difficulty levels instantly.',
  },
  {
    icon: FileText,
    title: 'Practical Assistant',
    description: 'Generate complete practical file formats in minutes.',
  },
  {
    icon: Calendar,
    title: 'Revision Planner',
    description: 'Create a day-wise study plan with progress tracking.',
  },
  {
    icon: Calculator,
    title: 'CGPA & Attendance',
    description: 'Track your academics like a pro dashboard.',
  },
];

const useCases = [
  {
    icon: Target,
    title: 'Before Exams',
    description: 'Quick revision with AI-generated summaries and important questions.',
  },
  {
    icon: FileText,
    title: 'During Practicals',
    description: 'Generate complete practical files with proper format instantly.',
  },
  {
    icon: Clock,
    title: 'Weekly Revision',
    description: 'Plan and track your weekly study schedule effortlessly.',
  },
  {
    icon: Brain,
    title: 'Placement Prep',
    description: 'Organize notes and practice questions for interviews.',
  },
];

const testimonials = [
  {
    quote: "CampusBuddy AI saved me during my end sems. The practical file generator is a lifesaver!",
    name: "Priya S.",
    role: "CSE, 3rd Year",
  },
  {
    quote: "Finally a tool that understands what engineering students actually need. Love the CGPA tracker!",
    name: "Rahul M.",
    role: "ECE, 4th Year",
  },
  {
    quote: "The revision planner helped me stay on track before my GATE exam. Highly recommend!",
    name: "Ananya K.",
    role: "ME, Final Year",
  },
];

const faqs = [
  {
    question: "Is CampusBuddy AI free to use?",
    answer: "Yes! This is a demo prototype that's completely free. All features work without any payment.",
  },
  {
    question: "Do I need to login or create an account?",
    answer: "No login required! Just click 'Try Free' and start using all features immediately.",
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Absolutely! CampusBuddy AI is fully responsive and works great on phones, tablets, and desktops.",
  },
  {
    question: "Is this made for engineering/AKTU students?",
    answer: "Yes, it's designed with engineering students in mind, but works for any academic field.",
  },
  {
    question: "Can I request new features?",
    answer: "This is a demo prototype showcasing what's possible. Feel free to explore all current features!",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">CampusBuddy AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Demo</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <a href="#features">View Demo</a>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link to="/dashboard">Try Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Demo Prototype • Student-First</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">CampusBuddy AI</span>
            <br />
            <span className="text-foreground">Your AI Student Assistant</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Summarize notes, generate important questions, prepare practical files,
            plan revision, and track CGPA — all in one clean dashboard.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="glow" size="xl" asChild>
              <Link to="/dashboard">
                Try Free — No Login Required
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <a href="#features">
                View Demo
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          
          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20" />
            <div className="relative glass-card rounded-2xl p-2 overflow-hidden">
              <div className="bg-card rounded-xl p-4 sm:p-6">
                {/* Mock dashboard header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 h-6 bg-muted rounded-lg" />
                </div>
                
                {/* Mock dashboard content */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                      <feature.icon className="w-8 h-8 text-primary mb-2" />
                      <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-2 bg-muted/50 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-8 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Built for Engineering Students</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>Fast • Practical • Clean UI</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-5 h-5 text-primary" />
              <span>Deployable Demo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful AI-driven tools designed specifically for students like you.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perfect for Every Scenario</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From last-minute exam prep to placement preparation, we've got you covered.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Students</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what fellow engineering students say about CampusBuddy AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 relative"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-semibold text-lg mb-2 flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Start Free in <span className="gradient-text">10 Seconds</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            No login, no payment, no hassle. Just click and start using all features.
          </p>
          <Button variant="glow" size="xl" asChild>
            <Link to="/dashboard">
              Open Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">CampusBuddy AI</span>
          </div>
          <p className="text-muted-foreground text-sm">Made by students, for students. ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
