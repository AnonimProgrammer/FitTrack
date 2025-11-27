import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HabitsView } from './components/HabitsView';
import { WorkoutsView } from './components/WorkoutsView';
import { ProgressView } from './components/ProgressView';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';

export type ViewType = 'habits' | 'workouts' | 'progress' | 'stats' | 'profile';
export type AuthView = 'login' | 'signup';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<ViewType>('habits');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
  };

  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginView
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView('signup')}
        />
      );
    }
    
    return (
      <SignupView
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onViewChange={setCurrentView} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-auto">
          {currentView === 'habits' && <HabitsView />}
          {currentView === 'workouts' && <WorkoutsView />}
          {currentView === 'progress' && <ProgressView />}
          {currentView === 'stats' && <StatsView />}
          {currentView === 'profile' && <ProfileView />}
        </main>
      </div>
    </div>
  );
}