import { Link, useLocation } from "react-router-dom";
import { Brain, Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

export default function Navbar() {
  const { user, isGuest, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!user || isGuest;

  const navLinks = [
    { to: "/", label: "Home" },
    ...(isLoggedIn ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">Concept Simplifier</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}>
              <Button variant="ghost" size="sm" className={isActive(l.to) ? "bg-accent" : ""}>
                {l.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isGuest ? "Guest" : user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="hero" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-glass-border p-4 animate-fade-up">
          <div className="flex flex-col gap-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${isActive(l.to) ? "bg-accent" : ""}`}>
                  {l.label}
                </Button>
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {isLoggedIn ? (
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
