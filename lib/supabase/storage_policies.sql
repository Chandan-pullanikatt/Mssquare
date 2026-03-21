-- Storage Buckets and RLS Policies for LMS

-- 1. Create Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('course-thumbnails', 'course-thumbnails', true),
  ('blog-images', 'blog-images', true),
  ('lesson-resources', 'lesson-resources', true),
  ('website-media', 'website-media', true),
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies for course-thumbnails (Manual Creation)
DO $$
BEGIN
    -- DROP existing policy if we need to update it
    DROP POLICY IF EXISTS "Admins have full access to course-thumbnails" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users have access to course-thumbnails" ON storage.objects;
    DROP POLICY IF EXISTS "Public read access for course-thumbnails" ON storage.objects;
    
    -- Authenticated Access
    CREATE POLICY "Authenticated users have access to course-thumbnails"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'course-thumbnails')
    WITH CHECK (bucket_id = 'course-thumbnails');

    -- Public Read
    CREATE POLICY "Public read access for course-thumbnails"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'course-thumbnails');
END $$;

-- 3. Storage RLS Policies for other buckets (Idempotent Loop)
DO $$
DECLARE
  b_id TEXT;
  buckets TEXT[] := ARRAY['blog-images', 'lesson-resources', 'website-media', 'team-images'];
  auth_policy_name TEXT;
  public_policy_name TEXT;
  old_admin_policy_name TEXT;
BEGIN
  FOREACH b_id IN ARRAY buckets LOOP
    auth_policy_name := 'Authenticated users access ' || b_id;
    public_policy_name := 'Public read access ' || b_id;
    old_admin_policy_name := 'Admins full access ' || b_id;

    -- Drop older policies to avoid duplicates
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', auth_policy_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', public_policy_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', old_admin_policy_name);

    -- Authenticated Access
    EXECUTE format('
      CREATE POLICY %I
      ON storage.objects FOR ALL
      TO authenticated
      USING (bucket_id = %L)
      WITH CHECK (bucket_id = %L)
    ', auth_policy_name, b_id, b_id);

    -- Public Read
    EXECUTE format('
      CREATE POLICY %I
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = %L)
    ', public_policy_name, b_id);
  END LOOP;
END $$;
