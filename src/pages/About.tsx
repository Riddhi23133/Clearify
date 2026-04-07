import { Brain, Zap, Heart, Users, BookOpen, Sparkles } from "lucide-react";

const features = [
  { icon: <Brain className="w-6 h-6" />, title: "AI-Powered", desc: "Advanced AI breaks down any complex topic into simple language" },
  { icon: <Zap className="w-6 h-6" />, title: "Instant Results", desc: "Get simplified explanations in seconds, not minutes" },
  { icon: <Users className="w-6 h-6" />, title: "For Everyone", desc: "Whether you're 10 or 60, we adapt to your level" },
  { icon: <BookOpen className="w-6 h-6" />, title: "Rich Content", desc: "Analogies, examples, step-by-step breakdowns and more" },
  { icon: <Heart className="w-6 h-6" />, title: "Free to Use", desc: "Start simplifying topics without any cost" },
  { icon: <Sparkles className="w-6 h-6" />, title: "Save & Share", desc: "Keep your history and share with friends" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12 hero-gradient">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Concept Simplifier</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We believe that knowledge should be accessible to everyone. Our AI-powered tool transforms
            complex topics into simple, easy-to-understand explanations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 glow-border hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 text-primary">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 text-center glow-border animate-fade-up">
          <h2 className="font-display text-2xl font-bold mb-4 gradient-text">Built for Learners</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether you're a first-year student struggling with new concepts, a professional exploring
            a new field, or just curious about the world — Concept Simplifier is your learning companion.
          </p>
        </div>
      </div>
    </div>
  );
}
