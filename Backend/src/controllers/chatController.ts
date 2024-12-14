import { User } from "controllers/authController";
import { supabase } from "../utils/supabaseClient";
import { Request, Response } from "express";

export interface Chat {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
}

interface RequestBody extends Request {
  body: {
    userId: string;
    message: string;
  };
}

export const createChat = async (
  req: RequestBody,
  res: Response
): Promise<Chat> => {
  const { userId, message } = req.body;
  const { data, error } = await supabase
    .from("chat")
    .insert([{ userId, message }])
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getChatsByUserId = async (
  req: Request & {
    body: {
      userId: string;
      page: number;
      limit: number;
    };
  },
  res: Response
): Promise<Chat[]> => {
  const { userId, page, limit } = req.body;
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return data as Chat[];
};

export const deleteChatById = async (
  req: Request & {
    params: {
      id: string;
    };
  },
  res: Response
): Promise<void> => {
  const chatId = req.params.id;
  const { error } = await supabase.from("chat").delete().eq("id", chatId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getMessagesByUserId = async (
  req: Request & {
    body: {
      userId: string;
      page: number;
      limit: number;
    };
  },
  res: Response
): Promise<Chat[]> => {
  const { userId, page, limit } = req.body;
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return data as Chat[];
};
