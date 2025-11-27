import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dumbbell } from 'lucide-react';
import * as authApi from '../api/auth';

interface LoginViewProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export function LoginView({ onLogin, onSwitchToSignup }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('token', res.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Dumbbell className="size-8 text-primary" />
          </div>
          <h2 className="text-center text-[20px]">Welcome Back</h2>
          <p className="text-muted-foreground text-center mt-2">
            Sign in to continue your fitness journey
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            onClick={onSwitchToSignup}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
}

