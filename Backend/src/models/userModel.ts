import { supabase } from "../utils/supabaseClient";

export interface User {
  id: string;
  email: string;
  password: string;
  fullname: string;
  email_confirmed: boolean;
}

export const createUser = async (
  email: string,
  password: string,
  fullname: string
) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password, fullname }]);
  return { data, error };
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return { data, error };
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);
  return { data, error };
};

export const deleteUser = async (id: string) => {
  const { data, error } = await supabase.from("users").delete().eq("id", id);
  return { data, error };
};
