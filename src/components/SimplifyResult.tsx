import { useState, useEffect } from "react";
import { Copy, Share2, Download, Check, Lightbulb, List, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SimplifyResultProps {
  result: {
    simple: string;
    steps: string[];
    example: string;
    analogy: string;
    keyPoints: string[];
  };
  topic: string;
}

function TypeWriter({ text, delay = 10 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);
  return <>{displayed}</>;
}

export default function SimplifyResult({ result, topic }: SimplifyResultProps) {
  const [copied, setCopied] = useState(false);

  const fullText = `Topic: ${topic}\n\n📝 Simple Explanation:\n${result.simple}\n\n📋 Step-by-Step:\n${result.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n🌍 Real-Life Example:\n${result.example}\n\n💡 Analogy:\n${result.analogy}\n\n🔑 Key Points:\n${result.keyPoints.map(p => `• ${p}`).join("\n")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Simplified: ${topic}`, text: fullText });
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/\s+/g, "_")}_simplified.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const sections = [
    { icon: <Sparkles className="w-5 h-5 text-primary" />, title: "Simple Explanation", content: result.simple },
    { icon: <List className="w-5 h-5 text-secondary" />, title: "Step-by-Step Breakdown", content: null, list: result.steps },
    { icon: <BookOpen className="w-5 h-5 text-primary" />, title: "Real-Life Example", content: result.example },
    { icon: <Lightbulb className="w-5 h-5 text-secondary" />, title: "Analogy", content: result.analogy },
  ];

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold gradient-text">Results</h2>
        <div className="flex gap-2">
          <Button variant="glass" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="glass" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {sections.map((s, i) => (
        <div key={i} className="glass-card p-5 glow-border" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="flex items-center gap-2 mb-3">
            {s.icon}
            <h3 className="font-display font-semibold">{s.title}</h3>
          </div>
          {s.content && <p className="text-muted-foreground leading-relaxed"><TypeWriter text={s.content} /></p>}
          {s.list && (
            <ol className="space-y-2">
              {s.list.map((item, j) => (
                <li key={j} className="flex gap-3 text-muted-foreground">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{j + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}

      <div className="glass-card p-5 glow-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Key Points</h3>
        </div>
        <ul className="space-y-2">
          {result.keyPoints.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
