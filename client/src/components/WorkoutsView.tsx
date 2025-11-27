import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Plus, Dumbbell, Clock, Flame } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as workoutsAPI from '../api/workouts';

interface Workout {
  id: string;
  description: string;
  type: string;
  duration: number;
  calories_burned: number;
  created_at: string;
}

export function WorkoutsView() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    description: '',
    type: 'Cardio',
    duration: 30,
    calories_burned: 200,
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      const workoutsData = await workoutsAPI.getWorkoutsRange(fromDate.toISOString().split('T')[0]);
      setWorkouts(workoutsData);
    };
    fetchWorkouts();
  }, []);

  const addWorkout = async () => {
    const workout = await workoutsAPI.createWorkout(
      newWorkout.description,
      newWorkout.type,
      newWorkout.duration,
      newWorkout.calories_burned
    );
    setWorkouts([workout, ...workouts]);
    setNewWorkout({ description: '', type: 'Cardio', duration: 30, calories_burned: 200 });
    setIsDialogOpen(false);
  };

  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Workout Log</h1>
          <p className="text-muted-foreground mt-1">Track and manage your fitness activities</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a New Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="workout-description">Workout Description</Label>
                <Input
                  id="workout-description"
                  placeholder="e.g., Morning Run"
                  value={newWorkout.description}
                  onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="workout-type">Type</Label>
                <Select
                  value={newWorkout.type}
                  onValueChange={(value) => setNewWorkout({ ...newWorkout, type: value })}
                >
                  <SelectTrigger id="workout-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newWorkout.calories_burned}
                  onChange={(e) => setNewWorkout({ ...newWorkout, calories_burned: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Button onClick={addWorkout} className="w-full">Add Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Workouts</p>
              <p className="mt-2">{workouts.length}</p>
            </div>
            <Dumbbell className="size-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Duration</p>
              <p className="mt-2">{totalDuration} min</p>
            </div>
            <Clock className="size-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Calories Burned</p>
              <p className="mt-2">{totalCalories}</p>
            </div>
            <Flame className="size-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Workouts List */}
      <div className="space-y-3">
        {workouts.map(w => (
          <Card key={w.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="size-6 text-primary" />
                </div>
                  <div>
                    <p>{w.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{w.created_at.slice(0, 10)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground">
                    {w.type}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4" /> <span className="text-sm">{w.duration} min</span>
                  </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flame className="size-4 text-orange-500" /> <span className="text-sm">{w.calories_burned} cal</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
