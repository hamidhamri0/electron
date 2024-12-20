import { supabase } from "../utils/supabaseClient";
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDEJcAVK1RBNbjoz3Bi2bkoWADU3agoUfw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  message: string;
  createdAt: Date;
}

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, message } = req.body;
    const { user } = req;

    console.log("chatId: ", chatId);
    console.log("message: ", message);
    console.log("user", user);

    let chat;
    if (chatId) {
      const { data, error } = await supabase
        .from("chat")
        .select("*")
        .eq("id", chatId)
        .single();

      if (error) {
        res.status(400).json({ error: "Chat not found" });
        return;
      }

      chat = data;
    } else {
      // Check if the userId exists in the users table
      const { error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (userError) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const { data, error } = await supabase
        .from("chat")
        .insert([{ user_id: user?.id, title: "", keywords: [] }])
        .select("*")
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      chat = data;
    }

    // Insert the user's message into the Message table
    const userMessage = {
      chat_id: chat.id,
      role: "user",
      message: message,
    };

    const { error: messageError } = await supabase
      .from("message")
      .insert([userMessage]);

    if (messageError) {
      res.status(500).json({ error: messageError.message });
      return;
    }

    // Fetch all messages for the chat to build the history
    const { data: messages, error: fetchError } = await supabase
      .from("message")
      .select("*")
      .eq("chat_id", chat.id);

    if (fetchError) {
      res.status(500).json({ error: fetchError.message });
      return;
    }

    const history = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.message }],
    }));

    const aiChat = model.startChat({ history });

    const { error: updateError } = await supabase
      .from("chat")
      .update({ last_message: new Date() })
      .eq("id", chat.id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const result = await aiChat.sendMessageStream(message);

    let aiResponse: string = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`${chunkText}`);
      aiResponse += chunkText;
    }
    // const aiResponse = result.response.text();

    // Insert the AI's response into the Message table
    const aiMessage = {
      chat_id: chat.id,
      role: "model",
      message: aiResponse,
    };

    const { error: aiMessageError } = await supabase
      .from("message")
      .insert([aiMessage]);

    if (aiMessageError) {
      res.status(500).json({ error: aiMessageError.message });
      return;
    }

    res.end();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getChatsByUserId = async (
  req: Request & {
    query: {
      type: "title" | "keywords";
      search: string;
      page: number;
      limit: number;
    };
  },
  res: Response
) => {
  const { page = 1, limit = 10, type, search } = req.query;
  const { user } = req;
  const userId = user?.id;

  let query = supabase.from("chat").select("*").eq("user_id", userId);

  if (search && search.trim()) {
    const trimmedSearch = search.trim();
    if (type === "title") {
      query = query.ilike("title", `%${trimmedSearch}%`);
    } else if (type === "keywords") {
      const keywords = trimmedSearch.split(/\s+/).filter(Boolean);

      if (keywords.length > 0) {
        query = query.contains("keywords", JSON.stringify(keywords));
      } else {
        return res.status(200).json({ data: [], next: false });
      }
    }
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  console.log(start, end);

  const { data, error } = await query
    .range(start, end)
    .order("last_message", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error); // Log the full error for debugging
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(200).json({ data: [], next: false });
  }

  const next = data.length > limit;
  const paginatedData = next ? data.slice(0, limit) : data;

  res.status(200).json({
    data: paginatedData,
    next,
  });
};

export const getMessagesByChatId = async (
  req: Request & {
    query: {
      chatId: string;
      page: number;
      limit: number;
    };
  },
  res: Response
) => {
  const { chatId, page, limit } = req.query;

  const { data, error } = await supabase
    .from("message")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at")
    .range((page - 1) * limit, page * limit);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const next = data.length > limit;
  const paginatedData = data?.slice(0, limit);

  res.status(200).json({ data: paginatedData, next });
};

export const createChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const user = req.user;
  const userId = user?.id;

  //check if user exists

  const { data: userExists, error: errorExistingUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (errorExistingUser) {
    res.status(400).json({ error: errorExistingUser.message });
    return;
  }

  const aiChat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: title }],
      },
    ],
  });

  // Generate a title for the chat based on the conversation
  const titleResult = await aiChat.sendMessage(
    `Generate a title and keywords for this conversation. I want the result to look exactly like this:
    Title: Title goes here.
    Keywords: Keyword 1, Keyword 2, Keyword 3
    DO NOT ADD MORE THAN 6 KEYWORDS
    DO NOT ADD OR REMOVE ANYTHING ELSE FROM THIS MESSAGE. THE MESSAGE MUST EXACTLY MATCH THE FORMAT ABOVE.
    `
  );
  const chatTitle = titleResult.response.text();
  const newTitle = chatTitle.split("\n")[0].split(":")[1];
  const keywordsExtracted = chatTitle
    .split("\n")[1]
    .split(":")[1]
    .split(",")
    .map((e) => e.trim());

  const { data, error } = await supabase
    .from("chat")
    .insert([
      {
        user_id: userId,
        title: newTitle,
        keywords: keywordsExtracted,
        last_message: new Date(),
      },
    ])
    .select("*")
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const updateChatTitleById = async (
  req: Request & {
    params: {
      chatId: string;
    };
    body: {
      title: string;
    };
  },
  res: Response
) => {
  const chatId = Number(req.params.chatId);
  const userId = req.user?.id;
  const { title } = req.body;

  const { data, error } = (await supabase
    .from("chat")
    .update({ title })
    .eq("id", chatId)
    .select("*")
    .single()) as { data: Chat; error: any };

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (data.user_id !== userId) {
    res
      .status(403)
      .json({ error: "You are not authorized to update this chat" });
    return;
  }
  res.status(200).json(data);
};

export const deleteChatById = async (
  req: Request & {
    params: {
      chatId: string;
    };
  },
  res: Response
) => {
  const chatId = req.params.chatId;
  const userId = req.user?.id;

  // query chat then check if user_id in chat is equal to userId
  const { data, error: errorQueryingChat } = await supabase
    .from("chat")
    .select("user_id")
    .eq("id", chatId)
    .single();

  if (errorQueryingChat) {
    res.status(500).json({ error: errorQueryingChat.message });
    return;
  }

  if (userId !== data.user_id) {
    res
      .status(403)
      .json({ error: "You are not authorized to delete this chat" });
    return;
  }

  const { error } = await supabase.from("chat").delete().eq("id", chatId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).json({ message: "Chat deleted successfully" });
};
