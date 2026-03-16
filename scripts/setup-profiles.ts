import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log("Ensuring 'profiles' table exists...");
  
  // We can't run raw SQL easily via the JS SDK without the RPC or a specific extension.
  // But we can check if it exists and try to create it or at least report status.
  
  const { error: profileError } = await supabase.from('profiles').select('*').limit(1);
  
  if (profileError && profileError.code === 'PGRST116' || profileError?.message?.includes('does not exist')) {
    console.log("Profiles table missing. You should run this SQL in your Supabase SQL Editor:");
    console.log(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'student',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      
      -- Policies
      CREATE POLICY "Users can view their own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
        
      CREATE POLICY "Users can update their own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);

      -- Trigger for new users (optional but recommended)
      -- CREATE OR REPLACE FUNCTION public.handle_new_user()
      -- RETURNS TRIGGER AS $$
      -- BEGIN
      --   INSERT INTO public.profiles (id, user_id, email, role)
      --   VALUES (NEW.id, NEW.id, NEW.email, 'student');
      --   RETURN NEW;
      -- END;
      -- $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- CREATE TRIGGER on_auth_user_created
      --   AFTER INSERT ON auth.users
      --   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
  } else {
    console.log("Profiles table already exists or produced an unexpected error:", profileError?.message);
  }
}

setupDatabase();
