import { Card } from './ui/card';
import { Trophy, Target, TrendingUp, Zap, Calendar } from 'lucide-react';

export function StatsView() {
  const achievements = [
    { id: 1, name: '7 Day Streak', description: 'Complete habits for 7 days in a row', unlocked: true },
    { id: 2, name: 'Century Club', description: 'Log 100 workouts', progress: 45, unlocked: false },
    { id: 3, name: 'Early Bird', description: 'Complete morning workout 30 times', progress: 22, unlocked: false },
    { id: 4, name: 'Consistency King', description: 'Maintain 90% habit completion for a month', unlocked: true },
  ];

  const stats = [
    { label: 'Total Workouts', value: '45', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Active Days', value: '32', icon: Calendar, color: 'text-blue-500' },
    { label: 'Habits Tracked', value: '5', icon: Target, color: 'text-green-500' },
    { label: 'Current Streak', value: '12', icon: Zap, color: 'text-orange-500' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1>Stats & Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Track your milestones and celebrate your progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2">{stat.value}</p>
                </div>
                <Icon className={`size-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Personal Records */}
      <Card className="p-6 mb-8">
        <h3 className="mb-6">Personal Records</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="size-4" />
              <span className="text-sm">Longest Workout</span>
            </div>
            <p>90 minutes</p>
            <p className="text-sm text-muted-foreground mt-1">Cycling - Nov 15</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap className="size-4" />
              <span className="text-sm">Most Calories</span>
            </div>
            <p>650 cal</p>
            <p className="text-sm text-muted-foreground mt-1">HIIT - Nov 18</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="size-4" />
              <span className="text-sm">Best Streak</span>
            </div>
            <p>15 days</p>
            <p className="text-sm text-muted-foreground mt-1">October 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
