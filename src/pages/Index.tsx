import { useState } from "react";
import { Sparkles, Mic, MicOff, Brain, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimplifyResult from "@/components/SimplifyResult";
import LoadingAnimation from "@/components/LoadingAnimation";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const LEVELS = ["Like I'm 10", "Like I'm 15", "Beginner", "Expert"] as const;

export default function Index() {
  const { user, isGuest } = useAuth();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<typeof LEVELS[number]>("Beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      setTopic(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const handleSimplify = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("simplify", {
        body: { topic: topic.trim(), level },
      });
      if (error) throw error;
      setResult(data);

      // Save to history if logged in
      if (user) {
        await supabase.from("history").insert({
          user_id: user.id,
          topic: topic.trim(),
          level,
          result: data,
        });
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to simplify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 hero-gradient">
      {/* Floating decorations */}
      <div className="fixed top-32 left-10 w-3 h-3 rounded-full bg-primary/30 animate-float" />
      <div className="fixed top-48 right-16 w-2 h-2 rounded-full bg-secondary/40 animate-float" style={{ animationDelay: "1s" }} />
      <div className="fixed bottom-32 left-1/4 w-4 h-4 rounded-full bg-primary/20 animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Simplifier</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Turn Complexity into{" "}
            <span className="gradient-text">Clarity ✨</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
            Understand anything in seconds
          </p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {[
            { icon: <Zap className="w-4 h-4" />, text: "Instant" },
            { icon: <BookOpen className="w-4 h-4" />, text: "ELI5 Style" },
            { icon: <Sparkles className="w-4 h-4" />, text: "AI Powered" },
          ].map((f, i) => (
            <div key={i} className="glass-card p-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        {/* Level selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                level === l
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground glow-primary"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="glass-card p-2 glow-border animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSimplify()}
                placeholder="Explain Quantum Computing..."
                className="w-full bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-lg"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleVoice} className={`rounded-xl ${listening ? "text-primary animate-pulse" : ""}`}>
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button variant="hero" size="lg" onClick={handleSimplify} disabled={loading} className="rounded-xl px-6">
              Simplify Now 🚀
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading && <LoadingAnimation />}
          {result && !loading && <SimplifyResult result={result} topic={topic} />}
          {!result && !loading && <EmptyState message="Type a topic and hit Simplify to get started!" />}
        </div>
      </div>
    </div>
  );
}
