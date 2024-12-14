import { Router } from "express";
import { createChat, getChatsByUserId } from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Route for creating a new chat
router.post("/createChat", authMiddleware, createChat);

router.get("/getChatsByUserId", authMiddleware, getChatsByUserId);

// Route for interacting with the AI
// router.post("/chats/:chatId/interact", authMiddleware, interactWithAI);

// Route for deleting a chat
// router.delete("/chats/:chatId", authMiddleware, deleteChat);

export default router;
