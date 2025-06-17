import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqrhnibstxtvikijvkgo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcmhuaWJzdHh0dmlraWp2a2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMxNDQsImV4cCI6MjA2NTQxOTE0NH0.6XyVlCk9QvfuyyD-Z9TK3h6FO_yjbJY1ZFNO1wMeH1I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);