import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Crown, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

const ROLE_PRESETS: { role: UserRole; label: string; email: string; password: string; icon: any; color: string }[] = [
  { role: 'admin', label: 'Admin', email: 'admin@relata.app', password: 'admin123', icon: ShieldCheck, color: 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20' },
  { role: 'ceo', label: 'CEO', email: 'ceo@relata.app', password: 'ceo123', icon: Crown, color: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' },
  { role: 'employee', label: 'Employee', email: 'employee@relata.app', password: 'emp123', icon: UserCircle, color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      // Redirect based on role - re-read from localStorage since state may not update immediately
      const savedUser = JSON.parse(localStorage.getItem('relata_user') || '{}');
      if (savedUser.role === 'employee') {
        navigate('/tasks');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const fillPreset = (preset: typeof ROLE_PRESETS[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setError('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your account.</p>
      </div>

      {/* Quick Login Presets */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Login</p>
        <div className="flex gap-2">
          {ROLE_PRESETS.map((preset) => (
            <button
              key={preset.role}
              onClick={() => fillPreset(preset)}
              type="button"
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-colors ${preset.color}`}
            >
              <preset.icon className="w-4 h-4" />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-card border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="#" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-card border-border/50 focus:border-primary transition-colors"
          />
        </div>

        {error && (
          <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-2 bg-primary hover:bg-primary/90 text-white rounded-full py-6 shadow-lg shadow-primary/25"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
};

export default Login;
