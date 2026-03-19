-- Create specialized instructors table to support multi-role users
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Admins can manage the instructors table
DROP POLICY IF EXISTS "Admins can manage instructors" ON public.instructors;
CREATE POLICY "Admins can manage instructors" 
ON public.instructors 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('lms_admin', 'cms_admin')
    )
);

-- 2. Instructors can view their own record
DROP POLICY IF EXISTS "Instructors can view themselves" ON public.instructors;
CREATE POLICY "Instructors can view themselves" 
ON public.instructors 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- Grant permissions
GRANT ALL ON public.instructors TO authenticated;
GRANT ALL ON public.instructors TO service_role;
GRANT ALL ON public.instructors TO anon;
