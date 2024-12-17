import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createChat,
  deleteChatById,
  getChatsByUserId,
  getMessagesByChatId,
  sendMessage,
  updateChatTitleById,
} from "../controllers/chatController";

const router = Router();

// Route for creating a new chat
router.post("/sendMessage", authMiddleware, sendMessage);
router.post("/createChat", authMiddleware, createChat);

router.get("/getMessagesByChatId", getMessagesByChatId);
router.delete("/deleteChatById/:chatId", authMiddleware, deleteChatById);
router.patch(
  "/updateChatTitleById/:chatId",
  authMiddleware,
  updateChatTitleById
);

router.get("/getChatsByUserId", authMiddleware, getChatsByUserId);

// Route for interacting with the AI
// router.post("/chats/:chatId/interact", authMiddleware, interactWithAI);

// Route for deleting a chat
// router.delete("/chats/:chatId", authMiddleware, deleteChat);

export default router;
