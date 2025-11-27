import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import * as habitsAPI from '../api/habits';
import * as workoutsAPI from '../api/workouts';
import { ActivityCalendar } from './ActivityCalendar';

export function ProgressView() {
  const [habitData, setHabitData] = useState<{ week: string; completion: number }[]>([]);
  const [workoutData, setWorkoutData] = useState<{ day: string; duration: number; calories_burned: number }[]>([]);
  const [summary, setSummary] = useState({ weeklyAvg: 0, totalCalories: 0, avgCompletion: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 83); 

      const habits = await habitsAPI.getRangeEntries(fromDate.toISOString().split('T')[0], today.toISOString().split('T')[0]);
      const weeksMap: Record<string, number[]> = {};

      habits.forEach((h: any) => {
        const habitDate = new Date(h.day_date);
        const weekIndex = getISOWeek(habitDate);

        const week = `Week ${weekIndex}`;
        if (!weeksMap[week]) weeksMap[week] = [];
        weeksMap[week].push(h.is_completed ? 1 : 0);
      });

      const habitArray = Object.entries(weeksMap).map(([week, arr]) => ({
        week,
        completion: arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0,
      }));
      setHabitData(habitArray);

      const avgCompletion = habitArray.length
        ? Math.round(habitArray.reduce((a, w) => a + w.completion, 0) / habitArray.length)
        : 0;

      fromDate.setDate(today.getDate() - 6); 
      const workouts = await workoutsAPI.getWorkoutsRange(fromDate.toISOString().split('T')[0]);
      const dayMap: Record<string, { duration: number; calories_burned: number }> = {};

      workouts.forEach((w: any) => {
        const day = new Date(w.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dayMap[day]) dayMap[day] = { duration: 0, calories_burned: 0 };
        dayMap[day].duration += w.duration;
        dayMap[day].calories_burned += w.calories_burned;
      });

      const workoutArray = [];
      let totalDuration = 0;
      let totalCalories = 0;
      let completedDays = 0;
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        completedDays += (dayMap[day] == null) ? 0 : 1;
        const val = dayMap[day] || { duration: 0, calories_burned: 0 };

        workoutArray.push({ day, ...val });
        totalDuration += val.duration;
        totalCalories += val.calories_burned;
      }
      setWorkoutData(workoutArray);

      const weeklyAvg = Math.round(totalDuration / ((completedDays == 0) ? 1 : completedDays));

      setSummary({ weeklyAvg, totalCalories, avgCompletion });
    };
    fetchData();
  }, []);

  const getISOWeek = (date: Date) => {
    const tmp = new Date(date.getTime());
    tmp.setHours(0, 0, 0, 0);

    tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
    const yearStart = new Date(tmp.getFullYear(), 0, 1);
    return Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1>Progress Tracking</h1>
        <p className="text-muted-foreground mt-1">Visualize your fitness journey and improvements</p>
      </div>

      <ActivityCalendar />

      {/* Workout Chart */}
      <Card className="p-6">
        <h3 className="mb-6">Weekly Workout Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workoutData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="#0f2d80ff" name="Duration (min)" radius={[8,8,0,0]} />
            <Bar dataKey="calories_burned" fill="#ea622dff" name="Calories" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Weekly Average</p>
            <p className="mt-2">{summary.weeklyAvg} min/day</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Calories</p>
            <p className="mt-2">{summary.totalCalories} cal</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Avg Completion</p>
            <p className="mt-2">{summary.avgCompletion}%</p>
          </Card>
        </div>
    </div>
  );
}

