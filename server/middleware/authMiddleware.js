import jwt from "jsonwebtoken";
import * as userRepo from "../repo/userRepository.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "devsecret";

export const requireAuth = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization && req.headers.authorization.split(" ")[1];
    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await userRepo.findUserById(payload.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
