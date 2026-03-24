-- Webservice Enquiries Table
CREATE TABLE IF NOT EXISTS webservice_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT,
    project_type TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE webservice_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable insert for everyone" ON webservice_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for admins" ON webservice_enquiries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
CREATE POLICY "Enable update for admins" ON webservice_enquiries FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
