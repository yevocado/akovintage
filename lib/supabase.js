import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = typeof rawUrl === "string" && rawUrl.startsWith("http");
const supabaseUrl  = isValidUrl ? rawUrl : "https://demo.supabase.co";
const supabaseAnonKey = (rawKey && rawKey !== "demo-key") ? rawKey : "demo-anon-key";

export const IS_DEMO = !isValidUrl;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
