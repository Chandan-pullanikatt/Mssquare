-- Fix permissions for adding instructors in the LMS Admin panel
-- This allows users with 'lms_admin' or 'cms_admin' roles to manage the profiles table.

-- 1. Enable RLS (should already be enabled, but just in case)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it's too restrictive or name clashes
DROP POLICY IF EXISTS "Allow admins to manage profiles" ON public.profiles;

-- 3. Create a comprehensive policy for admins (Fixed to avoid recursion)
-- We use a direct check on the current user's role without querying the profile table itself in the USING clause
CREATE POLICY "Allow admins to manage profiles" 
ON public.profiles FOR ALL 
TO authenticated
USING (
    (id = auth.uid()) -- Allow users to manage their OWN profile
    OR 
    (auth.jwt() -> 'app_metadata' ->> 'role' IN ('lms_admin', 'cms_admin')) -- Allow admins based on JWT metadata
    OR
    (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND (raw_app_meta_data->>'role' IN ('lms_admin', 'cms_admin'))))
);

-- 4. Ensure that EVERY authenticated user can at least view profiles (optional, but often needed)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);
