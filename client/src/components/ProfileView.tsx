import { act, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent } from './ui/tabs';
import { Edit2, Check, X } from 'lucide-react';

import * as userAPI from '../api/user';
import * as habitAPI from '../api/habits';
import * as workoutAPI from '../api/workouts';

export function ProfileView() {
  const [profile, setProfile] = useState({ fullname: '', email: '', bio: '', created_at: '' });
  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [activeStreak, setActiveStreak] = useState(0);

  useEffect(() => {
    const loadEverything = async () => {
      try {
        const data = await userAPI.getProfile();
        setProfile(data.user);
        setTempProfile(data.user);

        const created = new Date(data.user.created_at);
        const fromDate = new Date(created);
        fromDate.setDate(fromDate.getDate() - 1);
        const from = fromDate.toISOString().slice(0, 10);

        const workouts = await workoutAPI.getWorkoutsRange(from);
        setTotalWorkouts(workouts.length);

        const entries = await habitAPI.getRangeEntries(from, new Date().toISOString().slice(0, 10));
        calculateBestStreak(entries);
      } catch (err) {
        console.error("Failed loading profile page", err);
      } finally {
        setLoading(false);
      }
    };
    loadEverything();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-pulse">
        <Card className="p-6 h-90 mb-6" />
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 h-24" />
          <Card className="p-6 h-24" />
          <Card className="p-6 h-24" />
        </div>
      </div>
    );
  }

  function calculateBestStreak(entries: { habit_id: any; }[]) {
      const byHabit = new Map();

      entries.forEach((e: { habit_id: any; }) => {
        if (!byHabit.has(e.habit_id)) byHabit.set(e.habit_id, []);
        byHabit.get(e.habit_id).push(e);
      });

      let bestStreak = 0;

      for (const [_, habitEntries] of byHabit) {
        let currentStreak = 0;

        for (let i = 0; i < habitEntries.length; i++) {
          if (habitEntries[i].is_completed) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
      }
      setActiveStreak(bestStreak);
  };

  const handleSave = async () => {
    try {
      const updated = await userAPI.updateProfile(
        tempProfile.fullname,
        tempProfile.email,
        tempProfile.bio
      );
      setProfile(updated.user);
      setTempProfile(updated.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleReset = async () => {
    try {
      await userAPI.resetData();
      alert('All data reset.');

      const created = new Date(profile.created_at);
      const fromDate = new Date(created);
      fromDate.setDate(fromDate.getDate() - 1);
      const from = fromDate.toISOString().slice(0, 10);

      const workouts = await workoutAPI.getWorkoutsRange(from);
      setTotalWorkouts(workouts.length);

      const entries = await habitAPI.getRangeEntries(from, new Date().toISOString().slice(0, 10));
      calculateBestStreak(entries);

    } catch (err) {
      console.error("Failed to reset profile data", err);
    }
  };

  const handleDelete = async () => {
    await userAPI.deleteAccount();
    alert('Account deleted.');
    window.location.reload();
  };

  const stats = [
    { label: 'Member Since', value: profile.created_at.slice(0, 10) },
    { label: 'Total Workouts', value: totalWorkouts.toString() },
    { label: 'Current Streak', value: (activeStreak == 1) ? `${activeStreak} day` : `${activeStreak} days` },
  ];

  const initials = profile.fullname
    ? profile.fullname.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2>Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your profile</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsContent value="profile" className="space-y-6">

          {/* PROFILE CARD */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              {/* Avatar & Info */}
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3>{profile.fullname}</h3>
                  <p className="text-muted-foreground mt-1">{profile.email}</p>
                </div>
              </div>

              {/* Edit Buttons */}
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit2 className="size-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Check className="size-4 mr-2" /> Save
                  </Button>
                  <Button
                    onClick={() => {
                      setTempProfile(profile);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="size-4 mr-2" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={tempProfile.fullname}
                  onChange={e => setTempProfile({ ...tempProfile, fullname: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={tempProfile.email}
                  onChange={e => setTempProfile({ ...tempProfile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={tempProfile.bio}
                  onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>

          {/* STATS CARDS */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map(stat => (
              <Card key={stat.label} className="p-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* DANGER ZONE */}
          <Card className="p-6 border-destructive">
            <h3 className="text-destructive mb-4">Danger Zone</h3>
            <Button variant="outline" className="w-full" onClick={handleReset}>
              Reset All Progress Data
            </Button>

            <Button variant="destructive" className="w-full mt-2" onClick={handleDelete}>
              Delete Account
            </Button>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  );
}

