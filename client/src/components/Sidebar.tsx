import { Target, Dumbbell, TrendingUp, BarChart3 } from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'habits' as ViewType, label: 'Habits', icon: Target },
    { id: 'workouts' as ViewType, label: 'Workouts', icon: Dumbbell },
    { id: 'progress' as ViewType, label: 'Progress', icon: TrendingUp },
    { id: 'stats' as ViewType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r bg-card p-6">
      <div className="mb-8">
        <h1 className="text-primary text-[30px]">FitTrack</h1>
        <p className="text-muted-foreground text-[15px] mt-1">Your fitness companion</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}