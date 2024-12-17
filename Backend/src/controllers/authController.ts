import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailConfirmation } from "../services/emailService";
import { supabase } from "../utils/supabaseClient";
import { PostgrestResponse } from "@supabase/supabase-js";

export type User = {
  id: string;
  email: string;
  password: string;
  fullname: string;
  email_confirmed: boolean;
};

export const signUp = async (req: Request, res: Response) => {
  const { email, password, fullname } = req.body;

  if (!email || !password || !fullname) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  // check if already exists
  const { data: userExists, error: errorExistingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  } else if (errorExistingUser && errorExistingUser.code !== "PGRST116") {
    return res.status(400).json({ message: errorExistingUser.message });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, fullname }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const token = jwt.sign(
    { id: (data as User).id },
    "process.env.JWT_SECRET" as string,
    {
      expiresIn: "1h",
    }
  );

  await sendEmailConfirmation(email, token);

  res.status(201).json({ message: "User created. Please confirm your email." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  // if user email is not confirmed
  if (!user.email_confirmed) {
    return res.status(400).json({ message: "Please confirm your email." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id }, "process.env.JWT_SECRET" as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { id: user.id },
    "process.env.JWT_SECRET" as string,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({ message: "Login successful." });
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded: any = jwt.verify(token, "process.env.JWT_SECRET" as string);

    const { data, error } = await supabase
      .from("users")
      .select("email_confirmed")
      .eq("id", decoded.id)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (data.email_confirmed) {
      return res
        .status(400)
        .json({ message: "Email has already been confirmed." });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ email_confirmed: true })
      .eq("id", decoded.id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    res.status(200).json({ message: "Email confirmed successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(400).json({ message: "Invalid token." });
  }

  res.status(200).json(user);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful." });
};


