import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dumbbell } from 'lucide-react';
import * as authApi from '../api/auth';

interface SignupViewProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export function SignupView({ onSignup, onSwitchToLogin }: SignupViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await authApi.register(formData.name, formData.email, formData.password);
      localStorage.setItem('token', res.token);
      onSignup();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Dumbbell className="size-8 primary" />
          </div>
          <h2 className="text-center text-[20px]">Create Account</h2>
          <p className="text-muted-foreground text-center mt-2">
            Start your fitness journey today
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <Checkbox id="terms" required />
            <label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button onClick={onSwitchToLogin} className="text-primary hover:underline">
            Sign in
          </button>
        </div>
      </Card>
    </div>
  );
}
