import axiosInstance from './axiosInstance';

export const getHabits = async () => {
  const { data } = await axiosInstance.get('/habits');
  return data.habits;
};

export const createHabit = async (description, category) => {
  const { data } = await axiosInstance.post('/habits', { description, category });
  return data.habit;
};

export const deleteHabit = async (id) => {
  const { data } = await axiosInstance.delete(`/habits/${id}`);
  return data;
};

export const toggleHabitEntry = async (habit_id, is_completed) => {
  const { data } = await axiosInstance.put(`/habits/${habit_id}/entry`, { is_completed });
  return data.entry;
};

export const getTodayEntries = async () => {
  const { data } = await axiosInstance.get('/habits/entries/today');
  return data.entries;
};

export const getRangeEntries = async (from, to) => {
  const { data } = await axiosInstance.get(`/habits/entries/range?from=${from}&to=${to}`);
  return data.entries;
};
