import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bghchbrbiagwqcfcpdbo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaGNoYnJiaWFnd3FjZmNwZGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNjE0NzYsImV4cCI6MjA0OTczNzQ3Nn0.mYBpP3nEtdCUPHXNvE8B7omBsjWh4H81TQSmLJL2E9s"
);
