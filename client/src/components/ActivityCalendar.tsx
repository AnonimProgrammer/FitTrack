import { Card } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import * as habitsAPI from '../api/habits';
import * as workoutsAPI from '../api/workouts';
import { useEffect, useState } from 'react';

interface DayActivity {
  date: string;
  count: number;
}

function getIntensityColor(count: number): string {
  if (count === 0) return 'bg-muted';
  if (count === 1) return 'bg-orange-200 dark:bg-orange-950';
  if (count === 2) return 'bg-orange-300 dark:bg-orange-900';
  if (count === 3) return 'bg-orange-400 dark:bg-orange-800';
  if (count === 4) return 'bg-orange-500 dark:bg-orange-700';
  return 'bg-orange-600 dark:bg-orange-600';
}

export function ActivityCalendar() {
  const [activityData, setActivityData] = useState<DayActivity[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 83);

      const habits = await habitsAPI.getRangeEntries(fromDate.toISOString().split('T')[0], today.toISOString().split('T')[0]);
      const workouts = await workoutsAPI.getWorkoutsRange(fromDate.toISOString().split('T')[0]);

      const map: Record<string, number> = {};
      habits.forEach((h: any) => {
        const iso = h.day_date; 
        map[iso] = (map[iso] || 0) + (h.is_completed ? 1 : 0);
      });

      workouts.forEach((w: any) => {
        const iso = new Date(w.created_at).toISOString().split('T')[0];
        map[iso] = (map[iso] || 0) + 1;
      });      

      const data: DayActivity[] = [];
      for (let i = 0; i <= 83; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const isoDate = date.toISOString().split('T')[0];
        data.push({ date: isoDate, count: map[isoDate] || 0 });
      }
      setActivityData(data.reverse());
    };
    fetchActivity();
  }, []);

  const weeks: DayActivity[][] = [];
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7));
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex >= weeks.length) return null;
    const firstDay = weeks[weekIndex][0];
    if (!firstDay) return null;
    const date = new Date(firstDay.date);
    if (date.getDate() <= 7) return monthLabels[date.getMonth()];
    return null;
  };

  const totalActivities = activityData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = activityData.filter(day => day.count > 0).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3>Activity Calendar</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{totalActivities} activities in the last 12 weeks</span>
          <span>•</span>
          <span>{activeDays} active days</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="pl-5 flex gap-2 mb-2 ml-8">
            {weeks.map((_, idx) => {
              const label = getMonthLabel(idx);
              return <div key={idx} className="w-3 text-[14px] text-muted-foreground">{label}</div>;
            })}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 justify-between pr-2">
              {dayLabels.map((day, idx) => (
                <div key={day} className="h-3 text-[13px] text-muted-foreground flex items-center" style={{ opacity: idx % 2 === 0 ? 0 : 1 }}>{day}</div>
              ))}
            </div>

            <TooltipProvider>
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map(day => {
                      const formattedDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <Tooltip key={day.date} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className={`w-4 h-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 ${getIntensityColor(day.count)}`} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p>{day.count} {day.count === 1 ? 'activity' : 'activities'}</p>
                              <p className="text-muted-foreground">{formattedDate}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-[14px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-950" />
              <div className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-900" />
              <div className="w-3 h-3 rounded-sm bg-orange-400 dark:bg-orange-800" />
              <div className="w-3 h-3 rounded-sm bg-orange-500 dark:bg-orange-700" />
              <div className="w-3 h-3 rounded-sm bg-orange-600 dark:bg-orange-600" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
