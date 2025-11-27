import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, Plus, Flame, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import * as habitsAPI from '../api/habits';


interface Habit {
  id: string;
  description: string;
  streak: number;
  completed: boolean;
  category: string;
}

export function HabitsView() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayEntries, setTodayEntries] = useState<{ [key: string]: boolean }>({});
  const [newHabitName, setNewHabitName] = useState('');

  const [activeStreak, setActiveStreak] = useState(0);

  useEffect(() => {
    const fetchHabits = async () => {
      const habitsData = await habitsAPI.getHabits();
      setHabits(habitsData);

      const entries = await habitsAPI.getTodayEntries();
      const map: { [key: string]: boolean } = {};
      entries.forEach((e: any) => map[e.habit_id] = e.is_completed);
      setTodayEntries(map);

      const allEntries = await habitsAPI.getRangeEntries('2025-11-25', new Date().toISOString().slice(0, 10));
      const habitStreaks = calculateBestStreak(allEntries);

      setHabits(habitsData.map((h: { id: string; }) => ({
        ...h,
        streak: habitStreaks.get(h.id) ?? 0
      })));

    };
    fetchHabits();
  }, []);

  function calculateBestStreak(entries: any[]) {
    const byHabit = new Map<string, any[]>();
    const habitStreaks = new Map<string, number>();

    entries.forEach(e => {
      if (!byHabit.has(e.habit_id)) byHabit.set(e.habit_id, []);
      byHabit.get(e.habit_id)!.push(e);
    });

    let globalBest = 0;

    for (const [habitId, habitEntries] of byHabit.entries()) {
      let currentStreak = 0;
      let bestForHabit = 0;

      for (let i = 0; i < habitEntries.length; i++) {
        if (habitEntries[i].is_completed) {
          currentStreak++;
          bestForHabit = Math.max(bestForHabit, currentStreak);
          globalBest = Math.max(globalBest, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      habitStreaks.set(habitId, bestForHabit);
    }
    setActiveStreak(globalBest);
    return habitStreaks;
  }

  const toggleHabit = async (habit_id: string) => {
    const newValue = !todayEntries[habit_id];
    setTodayEntries(prev => ({ ...prev, [habit_id]: newValue }));

    setHabits(prev => {
      const updated = prev.map(h =>
        h.id === habit_id
          ? { ...h, streak: h.streak + (newValue ? 1 : -1) }
          : h
      );
      const maxStreak = updated.reduce((max, h) => Math.max(max, h.streak), 0);
      setActiveStreak(maxStreak);

      return updated;
    });

    try {
      await habitsAPI.toggleHabitEntry(habit_id, newValue);
    } catch (error) {
      console.error("Failed to update habit entry:", error);

      setTodayEntries(prev => ({ ...prev, [habit_id]: !newValue }));
      setHabits(prev => {
        const reverted = prev.map(h =>
          h.id === habit_id
            ? { ...h, streak: h.streak + (newValue ? -1 : 1) }
            : h
        );
        const maxStreak = reverted.reduce((max, h) => Math.max(max, h.streak), 0);
        setActiveStreak(maxStreak);

        return reverted;
      });
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    const habit = await habitsAPI.createHabit(newHabitName, 'Custom');

    setHabits(prev => {
      const updated = [...prev, { ...habit, streak: 0 }];
      const maxStreak = updated.reduce((max, h) => Math.max(max, h.streak), 0);
      setActiveStreak(maxStreak);
      return updated;
    });
    setNewHabitName('');
  };

  const deleteHabitHandler = async (id: string) => {
    await habitsAPI.deleteHabit(id);

    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      const maxStreak = updated.reduce((max, h) => Math.max(max, h.streak), 0);
      setActiveStreak(maxStreak); 
      return updated;
    });
  };

  const completedToday = habits.filter(h => todayEntries[h.id]).length;
  const totalHabits = habits.length;
  const bestStreakLabel = (activeStreak == 1) ? `${activeStreak} day` : `${activeStreak} days`;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1>Daily Habits</h1>
        <p className="text-muted-foreground mt-1">Track your daily habits and build lasting routines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Today's Progress</p>
              <p className="mt-2">{completedToday} / {totalHabits}</p>
            </div>
            <Trophy className="size-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completion Rate</p>
              <p className="mt-2">{totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0}%</p>
            </div>
            <BarChart3 className="size-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Best Streak</p>
              <p className="mt-2">{bestStreakLabel}</p>
            </div>
            <Flame className="size-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Add Habit */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new habit..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          className="flex-1"
        />
        <Button onClick={addHabit}>
          <Plus className="size-4 mr-2" /> 
          Add Habit
        </Button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map(habit => (
          <Card key={habit.id} className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={!!todayEntries[habit.id]}
                onCheckedChange={() => toggleHabit(habit.id)}
                id={`habit-${habit.id}`}
              />
              <label
                htmlFor={`habit-${habit.id}`}
                className={`flex-1 cursor-pointer ${todayEntries[habit.id] ? 'line-through text-muted-foreground' : ''}`}
              >
                {habit.description}
              </label>
              <span className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground">{habit.category}</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {habit.streak > 0 && (
                  <>
                    <Flame className="size-4 text-orange-500" />
                    <span>{habit.streak} day streak</span>
                  </>
                )}
                {/* Delete icon */}
                <Trash2 
                  className="w-5 h-5 ml-3 cursor-pointer text-red-500 hover:text-red-700" 
                  onClick={() => deleteHabitHandler(habit.id)} 
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
