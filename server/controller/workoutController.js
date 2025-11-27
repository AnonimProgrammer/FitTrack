import * as workoutService from "../service/workoutService.js";

export const logWorkout = async (req, res) => {
  try {
    const { description, type, duration, calories_burned } = req.body;
    const workout = await workoutService.logWorkout({
      user_id: req.user.id,
      description,
      type,
      duration,
      calories_burned
    });
    res.status(201).json({ workout });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const { from }  = req.query;
    const workouts = await workoutService.getWorkoutsSince(req.user.id, from)
    res.json({ workouts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};