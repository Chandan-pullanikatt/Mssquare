-- Fix for Certification Metadata and Storage

-- 1. Create Certificates Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS for Certificates
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users access certificates" ON storage.objects;
    DROP POLICY IF EXISTS "Public read access certificates" ON storage.objects;

    CREATE POLICY "Authenticated users access certificates"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'certificates')
    WITH CHECK (bucket_id = 'certificates');

    CREATE POLICY "Public read access certificates"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'certificates');
END $$;

-- 3. Ensure certification_metadata table exists with correct schema and UNIQUE constraint
-- We use a DO block to safely apply changes
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'certification_metadata') THEN
        CREATE TABLE certification_metadata (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            course_id UUID UNIQUE REFERENCES courses(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            template_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- Ensure course_id is unique if table already exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'certification_metadata_course_id_key'
        ) THEN
            ALTER TABLE certification_metadata ADD CONSTRAINT certification_metadata_course_id_key UNIQUE (course_id);
        END IF;
    END IF;
END $$;

-- 4. Enable RLS and add policies
ALTER TABLE certification_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public certification viewing" ON certification_metadata;
DROP POLICY IF EXISTS "Admin certification manage" ON certification_metadata;

CREATE POLICY "Public certification viewing" ON certification_metadata 
FOR SELECT USING (true);

CREATE POLICY "Admin certification manage" ON certification_metadata 
FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin')
);
