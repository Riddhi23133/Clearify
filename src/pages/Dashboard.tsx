import { useState, useEffect } from "react";
import { Search, Trash2, Copy, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import EmptyState from "@/components/EmptyState";
import SimplifyResult from "@/components/SimplifyResult";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  topic: string;
  level: string;
  result: any;
  created_at: string;
}

export default function Dashboard() {
  const { user, isGuest } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setHistory(data);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("history").delete().eq("id", id);
    setHistory(h => h.filter(i => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success("Deleted");
  };

  const copyItem = (item: HistoryItem) => {
    navigator.clipboard.writeText(JSON.stringify(item.result, null, 2));
    toast.success("Copied to clipboard");
  };

  const filtered = history.filter(h =>
    h.topic.toLowerCase().includes(search.toLowerCase())
  );

  const userName = isGuest ? "Guest" : user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen pt-20 pb-12 hero-gradient">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-bold mb-2">
            Hey <span className="gradient-text">{userName}</span>, ready to simplify today? 🧠
          </h1>
          <p className="text-muted-foreground">Your simplified concepts are saved here</p>
        </div>

        {isGuest ? (
          <div className="glass-card p-8 text-center glow-border animate-fade-up">
            <p className="text-muted-foreground mb-4">Sign in to save your history and access it anytime.</p>
            <Button variant="hero" onClick={() => window.location.href = "/login"}>Sign In to Save History</Button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="glass-card p-2 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 px-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search your history..."
                  className="flex-1 bg-transparent py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </div>

            {selectedItem ? (
              <div className="animate-fade-up">
                <Button variant="glass" size="sm" onClick={() => setSelectedItem(null)} className="mb-4">
                  ← Back to History
                </Button>
                <SimplifyResult result={selectedItem.result} topic={selectedItem.topic} />
              </div>
            ) : loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : filtered.length === 0 ? (
              <EmptyState message={search ? "No matching topics found" : "No history yet. Go simplify something!"} />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((item, i) => (
                  <div
                    key={item.id}
                    className="glass-card p-4 glow-border cursor-pointer hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-semibold text-foreground line-clamp-1">{item.topic}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{item.level}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.result?.simple?.slice(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedItem(item)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyItem(item)}>
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
