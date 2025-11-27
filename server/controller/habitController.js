import * as habitService from "../service/habitService.js";

export const createHabit = async (req, res) => {
  try {
    const { description, category } = req.body;
    const habit = await habitService.createHabit({ user_id: req.user.id, description, category });
    res.status(201).json({ habit });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await habitService.getHabits(req.user.id);
    res.json({ habits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    await habitService.deleteHabit(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upsertEntry = async (req, res) => {
  try {
    const { id: habit_id } = req.params;
    const { is_completed } = req.body;
    const entry = await habitService.upsertHabitEntry({ habit_id, user_id: req.user.id, is_completed });
    res.json({ entry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTodayEntries = async (req, res) => {
  try {
    const entries = await habitService.getTodayEntries(req.user.id);
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEntriesByRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    const entries = await habitService.getEntriesByRange(req.user.id, from, to);
    res.json({ entries });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};