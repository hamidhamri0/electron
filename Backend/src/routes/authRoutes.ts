import express from "express";
import {
  signUp,
  login,
  confirmEmail,
  getUserInfo,
  logout,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Sign Up Route
router.post("/signup", signUp);

// Login Route
router.post("/login", login);

// Email Confirmation Route
router.post("/confirm-email/:token", confirmEmail);

// Get userInfo
router.get("/me", authMiddleware, getUserInfo);

router.post("/logout", logout);

export default router;
