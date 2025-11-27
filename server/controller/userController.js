import * as userService from "../service/userService.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, bio } = req.body;
    const updated = await userService.updateProfile({ user_id: req.user.id, fullname, bio });
    res.json({ user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetData = async (req, res) => {
  try {
    await userService.resetUserData(req.user.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await userService.deleteAccount(req.user.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
