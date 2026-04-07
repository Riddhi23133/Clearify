import { Sparkles } from "lucide-react";

export default function EmptyState({ message = "No results yet" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 animate-fade-up">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-glass-border flex items-center justify-center animate-float">
        <Sparkles className="w-10 h-10 text-primary/50" />
      </div>
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}
