import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";
import type { User } from "../models/userModel";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. No token provided." });
  }

  try {
    const decoded: any = jwt.verify(token, "process.env.JWT_SECRET" as string);
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. User not found." });
    }

    user.password = undefined;
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Invalid token." });
  }
};

export { authMiddleware };
