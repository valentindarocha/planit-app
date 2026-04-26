import { createClient } from "@supabase/supabase-js";

// Temporal: hardcodeado para descartar problema de variables de entorno
export const supabase = createClient(
  'https://cfzulzkifiajvfouevzq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVsemtpZmlhanZmb3VldnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTg4MDksImV4cCI6MjA5MjU3NDgwOX0.X_4l6orKcDP89_7Hc7T06KidgxnYTqFEgzUMrnptNjQ',
);
