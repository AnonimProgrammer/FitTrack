import axiosInstance from './axiosInstance';

export const getWorkoutsRange = async (from) => {
  const { data } = await axiosInstance.get(`/workouts/range?from=${from}`);
  return data.workouts;
};

export const createWorkout = async (description, type, duration, calories_burned) => {
  const { data } = await axiosInstance.post('/workouts', { description, type, duration, calories_burned });
  return data.workout;
};
