-- 1. Drop existing restricted policies for career_applications
DROP POLICY IF EXISTS "Enable select for admins" ON career_applications;
DROP POLICY IF EXISTS "Enable update for admins" ON career_applications;
DROP POLICY IF EXISTS "Enable delete for admins" ON career_applications;

-- 2. Create updated policies for career_applications including cms_admin
CREATE POLICY "Enable select for admins" ON career_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);

CREATE POLICY "Enable update for admins" ON career_applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);

CREATE POLICY "Enable delete for admins" ON career_applications FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);


-- 3. Drop existing restricted policies for instructor_applications
DROP POLICY IF EXISTS "Enable select for admins" ON instructor_applications;
DROP POLICY IF EXISTS "Enable update for admins" ON instructor_applications;

-- 4. Create updated policies for instructor_applications including cms_admin
CREATE POLICY "Enable select for admins" ON instructor_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);

CREATE POLICY "Enable update for admins" ON instructor_applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);


-- 5. Update Storage Policies for 'applications' bucket
DROP POLICY IF EXISTS "Allow admins to read resumes" ON storage.objects;

CREATE POLICY "Allow admins to read resumes" ON storage.objects FOR SELECT TO authenticated USING (
    bucket_id = 'applications' AND 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin', 'cms_admin'))
);
