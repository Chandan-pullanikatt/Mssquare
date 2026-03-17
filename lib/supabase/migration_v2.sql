-- Migration: Upgrade LMS for Course-Specific Content

-- 1. Add progress to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- 2. Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create certification_metadata table
CREATE TABLE IF NOT EXISTS certification_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID UNIQUE REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    template_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Assuming basic auth-based access for now)
-- You may need to refine these based on your specific requirements

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects viewing" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin projects manage" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'lms_admin')
);

-- Assignments
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public assignments viewing" ON assignments FOR SELECT USING (true);
CREATE POLICY "Admin assignments manage" ON assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'lms_admin')
);

-- Certification Metadata
ALTER TABLE certification_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public certification viewing" ON certification_metadata FOR SELECT USING (true);
CREATE POLICY "Admin certification manage" ON certification_metadata FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'lms_admin')
);
