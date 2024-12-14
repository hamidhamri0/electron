import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();



// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

export default app;
