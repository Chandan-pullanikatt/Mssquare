-- FIX: CMS Admin Permissions for Blogs and Enrollments
-- Run this in your Supabase SQL Editor

-- 1. Ensure Blogs are manageable by Admins
DROP POLICY IF EXISTS "Allow authenticated full access to blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;

CREATE POLICY "Admins can manage all blogs" 
ON public.blogs FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
);

-- 2. Ensure Enrollments are manageable by Admins
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
CREATE POLICY "Admins can manage all enrollments" 
ON public.enrollments FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
);

-- 3. Verify Your Profile Role (IMPORTANT)
-- Ensure your actual login account has the 'cms_admin' role 
-- Replace the email below with your login email if different
UPDATE public.profiles 
SET role = 'cms_admin' 
WHERE email = 'chandan@mssquare.com'; 
