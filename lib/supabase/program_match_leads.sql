-- Program Match Leads Table
CREATE TABLE IF NOT EXISTS program_match_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE program_match_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable insert for everyone" ON program_match_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for admins" ON program_match_leads FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('lms_admin', 'business_admin'))
);
