import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Users, CheckSquare, Calendar, Settings, LayoutDashboard, 
  FileText, CreditCard, Building2, ArrowRight, Hash
} from 'lucide-react';

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigate', path: '/dashboard' },
  { id: 'people', label: 'Go to People', icon: Users, category: 'Navigate', path: '/people' },
  { id: 'tasks', label: 'Go to Tasks', icon: CheckSquare, category: 'Navigate', path: '/tasks' },
  { id: 'meetings', label: 'Go to Meetings', icon: Calendar, category: 'Navigate', path: '/meetings' },
  { id: 'documents', label: 'Go to Documents', icon: FileText, category: 'Navigate', path: '/documents' },
  { id: 'invoices', label: 'Go to Invoices', icon: CreditCard, category: 'Navigate', path: '/invoices' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, category: 'Navigate', path: '/settings' },
  { id: 'new-person', label: 'Add New Person', icon: Users, category: 'Action', path: '/people' },
  { id: 'new-task', label: 'Create New Task', icon: CheckSquare, category: 'Action', path: '/tasks' },
  { id: 'schedule-meeting', label: 'Schedule Meeting', icon: Calendar, category: 'Action', path: '/meetings' },
  { id: 'sarah', label: 'Sarah Jenkins', icon: Users, category: 'People', path: '/people/1' },
  { id: 'michael', label: 'Michael Chen', icon: Users, category: 'People', path: '/people/2' },
  { id: 'techcorp', label: 'TechCorp', icon: Building2, category: 'Organization', path: '/organizations/1' },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  Navigate: 'text-primary bg-primary/10',
  Action: 'text-success bg-success/10',
  People: 'text-secondary bg-secondary/10',
  Organization: 'text-accent bg-accent/10',
};

const CommandPalette = ({ open, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) { setQuery(''); setSelected(0); }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) handleSelect(filtered[selected].path);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, filtered, selected, handleSelect, onClose]);

  const groups = filtered.reduce<Record<string, typeof commands>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-xl bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search people, tasks, commands..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
              />
              <kbd className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground border border-border/50">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <Hash className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground font-medium">No results found</p>
                </div>
              ) : (
                Object.entries(groups).map(([category, items]) => (
                  <div key={category} className="mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-1">{category}</p>
                    {items.map((cmd) => {
                      const globalIdx = filtered.findIndex(f => f.id === cmd.id);
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd.path)}
                          onMouseEnter={() => setSelected(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                            selected === globalIdx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/60'
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${categoryColors[category] || 'text-muted-foreground bg-muted'}`}>
                            <cmd.icon className="w-4 h-4" />
                          </span>
                          <span className="flex-1 font-medium text-sm">{cmd.label}</span>
                          {selected === globalIdx && <ArrowRight className="w-4 h-4 opacity-50" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer Hint */}
            <div className="border-t border-border/50 px-4 py-2.5 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 font-mono">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 font-mono">↵</kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 font-mono">ESC</kbd> Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
