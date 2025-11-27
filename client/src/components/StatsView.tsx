import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Trophy, Target, TrendingUp, Award, Zap, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';

import * as workoutAPI from '../api/workouts';
import * as habitAPI from '../api/habits';
import * as userAPI from '../api/user';
interface Workout {
  id: string;
  description: string;
  type: string;
  duration: number;
  calories_burned: number;
  created_at: string;
}

export function StatsView() {
  const [loading, setLoading] = useState(true);

  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [habitsTracked, setHabitsTracked] = useState(0);
  const [currentBestStreak, setCurrentBestStreak] = useState(0);

  const [longestWorkout, setLongestWorkout] = useState<Workout>();
  const [maxCalories, setMaxCalories] = useState<Workout>();
  const [bestStreakAllTime, setBestStreakAllTime] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const profile = await userAPI.getProfile();
        const created = new Date(profile.user.created_at);
        const from = created.toISOString().slice(0, 10);
        const to = new Date().toISOString().slice(0, 10);

        const workouts = await workoutAPI.getWorkoutsRange(from);
        setTotalWorkouts(workouts.length);

        if (workouts.length > 0) {
          const longest = workouts.reduce((m: { duration: number; }, w: { duration: number; }) =>
            w.duration > m.duration ? w : m
          );
          setLongestWorkout(longest);

          const maxCal = workouts.reduce((m: { calories_burned: number; }, w: { calories_burned: number; }) =>
            w.calories_burned > m.calories_burned ? w : m
          );
          setMaxCalories(maxCal);
        }

        const allHabits = await habitAPI.getHabits();
        const entries = await habitAPI.getRangeEntries(from, to);
        setHabitsTracked(allHabits.length);

        const activityMap = new Set(
          [...workouts, ...entries].map((e) =>
            new Date(e.created_at).toDateString()
          )
        );
        setActiveDays(activityMap.size);

        const best = computeBestHabitStreak(entries);
        setCurrentBestStreak(best);
        setBestStreakAllTime(best); 

      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  function computeBestHabitStreak(entries: any[]) {
    const byHabit = new Map();
    entries.forEach((e: { habit_id: any; }) => {
      if (!byHabit.has(e.habit_id)) byHabit.set(e.habit_id, []);
      byHabit.get(e.habit_id).push(e);
    });

    let best = 0;

    for (const habitEntries of byHabit.values()) {
      habitEntries.sort(
        (a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let streak = 0;
      for (let e of habitEntries) {
        if (e.is_completed) {
          streak++;
          best = Math.max(best, streak);
        } else {
          streak = 0;
        }
      }
    }
    return best;
  }

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto animate-pulse">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6 h-24" />
          <Card className="p-6 h-24" />
          <Card className="p-6 h-24" />
          <Card className="p-6 h-24" />
        </div>
        <Card className="p-6 h-48" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Workouts', value: totalWorkouts, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Active Days', value: activeDays, icon: Calendar, color: 'text-blue-500' },
    { label: 'Habits Tracked', value: habitsTracked, icon: Target, color: 'text-green-500' },
    { label: 'Current Streak', value: currentBestStreak, icon: Zap, color: 'text-orange-500' },
  ];

  const achievements = [
    {
      id: 1,
      name: '7 Day Streak',
      description: 'Complete habits for 7 days in a row',
      unlocked: currentBestStreak >= 7,
      progress: Math.min((currentBestStreak / 7) * 100, 100),
    },
    {
      id: 2,
      name: 'Century Club',
      description: 'Log 100 workouts',
      unlocked: totalWorkouts >= 100,
      progress: Math.min((totalWorkouts / 100) * 100, 100),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2>Your Stats & Achievements</h2>
        <p className="text-muted-foreground mt-1">
          Track your milestones and celebrate your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2">{s.value}</p>
                </div>
                <Icon className={`size-8 ${s.color}`} />
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
            {longestWorkout ? (
              <>
                <p>{longestWorkout.duration} minutes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {longestWorkout.description} - 
                  {new Date(longestWorkout.created_at).toDateString().slice(3)}
                </p>
              </>
            ) : <p>No workouts yet</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap className="size-4" />
              <span className="text-sm">Most Calories</span>
            </div>
            {maxCalories ? (
              <>
                <p>{maxCalories.calories_burned} cal</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {maxCalories.description} - 
                  {new Date(maxCalories.created_at).toDateString().slice(3)}
                </p>
              </>
            ) : <p>No data</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="size-4" />
              <span className="text-sm">Best Streak</span>
            </div>
            <p>{bestStreakAllTime} days</p>
            <p className="text-sm text-muted-foreground mt-1">
              All Time Record
            </p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <h3 className="mb-6">Achievements</h3>
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((a) => (
          <Card key={a.id} className={`p-6 ${a.unlocked ? 'border-primary' : ''}`}>
            <div className="flex items-start gap-4">
              <div
                className={`size-12 rounded-full flex items-center justify-center ${
                  a.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <Award className="size-6" />
              </div>

              <div className="flex-1">
                <p className={a.unlocked ? 'text-primary' : ''}>{a.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{a.description}</p>

                {!a.unlocked && a.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span>{Math.round(a.progress)}%</span>
                    </div>
                    <Progress value={a.progress} />
                  </div>
                )}

                {a.unlocked && (
                  <p className="mt-2 text-sm text-primary">✓ Unlocked</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
