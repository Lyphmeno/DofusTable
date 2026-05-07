# Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Replace `you@example.com` with your real login email before running it.
4. Enable an auth provider in Supabase Auth. Magic link email is enough for V1.

The app will still check the session client/server side later, but the database is already protected by Row Level Security.
