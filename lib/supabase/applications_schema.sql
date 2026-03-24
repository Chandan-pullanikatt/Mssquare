-- Applications Table
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor Applications Table
CREATE TABLE IF NOT EXISTS instructor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for career_applications
-- Allow anyone to insert (public submission)
CREATE POLICY "Enable insert for everyone" ON career_applications FOR INSERT WITH CHECK (true);
-- Allow only admins to view/update
CREATE POLICY "Enable select for admins" ON career_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
CREATE POLICY "Enable update for admins" ON career_applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);

-- RLS Policies for instructor_applications
CREATE POLICY "Enable insert for everyone" ON instructor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for admins" ON instructor_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
CREATE POLICY "Enable update for admins" ON instructor_applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);

-- Storage Bucket Policies (Assuming bucket 'applications' exists)
-- Allow public uploads to 'resumes/' path
CREATE POLICY "Allow public uploads to resumes" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'applications' AND (storage.foldername(name))[1] = 'resumes'
);

-- Allow admins to read resumes
CREATE POLICY "Allow admins to read resumes" ON storage.objects FOR SELECT TO authenticated USING (
    bucket_id = 'applications' AND 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
