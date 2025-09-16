# Supabase Setup for Pixel-Harvest

This guide explains how to set up Supabase for online features in Pixel-Harvest.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

## 2. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your **Project URL** and **anon/public key**

## 3. Configure the Game

1. Open `index.html`
2. Find the Supabase configuration section (around line 1178)
3. Replace the placeholder values:

```javascript
let supabaseUrl = 'https://your-actual-project-id.supabase.co';
let supabaseKey = 'your-actual-anon-key-here';
```

## 4. Create Database Table

1. Go to the SQL Editor in your Supabase dashboard
2. Run this SQL to create the profiles table:

```sql
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    character TEXT NOT NULL,
    character_color TEXT NOT NULL,
    high_score INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true);
```

## 5. Add Supabase Client Library

Add this script tag before the closing `</body>` tag in `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Then update the client initialization code to:

```javascript
// Initialize Supabase client
if (supabaseUrl !== 'https://your-project.supabase.co' && supabaseKey !== 'your-anon-key') {
    onlineMode = true;
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
} else {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
}
```

## 6. Test Online Features

Once configured:
- Player profiles will sync to Supabase
- High scores will be stored online
- Leaderboard will show global rankings
- Players can access their profiles from any device

## Security Notes

The current setup uses a simple policy that allows all operations. For production use, consider:
- Implementing user authentication
- Adding more restrictive Row Level Security policies
- Validating data on the server side

## Troubleshooting

- Check browser console for any errors
- Verify your Supabase URL and key are correct
- Ensure the profiles table was created successfully
- Check that Row Level Security policies allow the operations you need