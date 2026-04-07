import { Brain } from "lucide-react";

const messages = ["Thinking... 🤔", "Breaking it down...", "Making it simple...", "Almost there... ✨"];

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-12 animate-fade-up">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse glow-primary">
          <Brain className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute -inset-4 rounded-3xl border border-primary/20 animate-ping opacity-20" />
      </div>
      <div className="space-y-2 text-center">
        {messages.map((msg, i) => (
          <p
            key={i}
            className="text-muted-foreground animate-pulse text-sm"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
