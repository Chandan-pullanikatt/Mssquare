-- Fix CMS Permissions for website_sections
-- This ensures that cms_admin has full access to update sections.

-- 1. Ensure the policy exists and is correct
DROP POLICY IF EXISTS "Allow authenticated full access to website sections" ON public.website_sections;

CREATE POLICY "Allow authenticated full access to website sections" 
ON public.website_sections FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
);

-- 2. Verify if the current user has a profile record.
-- NOTE: If you still get 403, run the following to manually ensure your user has the cms_admin role in profiles:
-- INSERT INTO public.profiles (id, user_id, email, role)
-- VALUES ('YOUR_USER_ID', 'YOUR_USER_ID', 'YOUR_EMAIL', 'cms_admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'cms_admin';
