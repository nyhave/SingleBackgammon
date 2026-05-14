# Supabase Setup Instructions

## Step 1: Create Tables

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Paste the contents of `docs/supabase-schema.sql`
6. Click **Run**

All tables will be created automatically.

## Step 2: Enable Real-time (Important!)

For the multiplayer sync to work:

1. Go to **Database** → **Replication**
2. Enable real-time for:
   - `games` table
   - `game_moves` table

## Step 3: Set RLS Policies (Optional but Recommended)

If you want basic security:

1. Go to **Authentication** → **Policies**
2. Enable RLS on `games`, `game_moves`, `players`
3. Create policies to allow public access (or add authentication)

## Step 4: Verify Connection

In Supabase:
- Go to **Settings** → **API**
- Copy your `Project URL` and `anon public key`
- Update `.env` file in your React app

## ✅ You're Ready!

Start the React app:
```bash
npm start
```

Test with 2 browser windows to see real-time sync! 🎮

## Troubleshooting

**Real-time not working?**
- Ensure real-time is enabled for the tables (step 2)
- Check browser console for WebSocket errors

**Table creation failed?**
- Check SQL syntax
- Look for error messages in Supabase UI

**Need to reset?**
- You can drop and recreate tables in SQL Editor
