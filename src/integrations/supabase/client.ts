// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zgdfjcodbzpkjlgnjxrk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZGZqY29kYnpwa2psZ25qeHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjMzMTcsImV4cCI6MjA2NDc5OTMxN30.ncNyyT8_Os5PvlSU8Cfo0QreWnQmL73ei_K_bGALY-c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);