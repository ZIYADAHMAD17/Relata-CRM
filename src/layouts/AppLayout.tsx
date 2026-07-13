import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, LayoutDashboard, Users, CheckSquare, Calendar,
  FileText, CreditCard, Settings, Bell, Search, Building2, BarChart3, LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommandPalette from '@/components/CommandPalette';
import { useAuth } from '@/contexts/AuthContext';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'People', path: '/people' },
  { icon: Building2, label: 'Organizations', path: '/organizations' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Meetings', path: '/meetings' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: CreditCard, label: 'Invoices', path: '/invoices' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

const employeeNavItems = [
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Meetings', path: '/meetings' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: CreditCard, label: 'Invoices', path: '/invoices' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-danger/10 text-danger border border-danger/20' },
  ceo: { label: 'CEO', color: 'bg-warning/10 text-warning border border-warning/20' },
  employee: { label: 'Employee', color: 'bg-primary/10 text-primary border border-primary/20' },
};

const AppLayout = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isEmployee = user?.role === 'employee';
  const navItems = isEmployee ? employeeNavItems : adminNavItems;
  const badge = user ? ROLE_BADGE[user.role] : null;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden text-foreground">

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border/50 bg-card/40 backdrop-blur-xl p-4 shrink-0 fixed left-0 top-0 z-30">
        <Link to={isEmployee ? '/tasks' : '/dashboard'} className="flex items-center gap-2.5 px-2 py-4 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Relata</span>
        </Link>

        {/* Search Trigger */}
        <button
          onClick={() => setCmdOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl bg-muted/60 border border-border/50 text-muted-foreground text-sm hover:bg-muted transition-colors text-left"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1">Search...</span>
          <kbd className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border/50">⌘K</kbd>
        </button>

        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto pr-1 -mr-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>

          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 mt-1 p-2 rounded-xl hover:bg-muted/50 transition-colors group">
            <Avatar className="w-8 h-8 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">{user?.name || 'User'}</span>
              {badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit mt-0.5 ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64">

        {/* Ambient Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

        {/* Top Header */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold">Relata</span>
            </div>
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Quick search
              <kbd className="font-mono bg-background px-1 rounded text-[10px] border border-border">Ctrl+K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-background" />
            </button>
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AppLayout;
