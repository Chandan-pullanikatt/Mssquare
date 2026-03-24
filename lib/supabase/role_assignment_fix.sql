-- 1. Create admin_allowlist table
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('lms_admin', 'business_admin', 'cms_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update handle_new_user trigger logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT;
    allowlist_role TEXT;
BEGIN
    -- Check admin allowlist
    SELECT role INTO allowlist_role FROM public.admin_allowlist WHERE email = NEW.email;
    
    IF allowlist_role IS NOT NULL THEN
        assigned_role := allowlist_role;
    ELSE
        -- Select role from metadata (safely handling nested JSON)
        assigned_role := COALESCE(
            NEW.raw_user_meta_data->>'role',
            'student'
        );
        
        -- Restrict metadata roles to student or business_client only
        IF assigned_role NOT IN ('student', 'business_client') THEN
            assigned_role := 'student';
        END IF;
    END IF;

    -- Insert into profiles
    INSERT INTO public.profiles (id, user_id, email, role)
    VALUES (NEW.id, NEW.id, NEW.email, assigned_role)
    ON CONFLICT (id) DO UPDATE SET role = assigned_role;

    -- Update user app_metadata for middleware to read directly
    -- Note: Updating auth.users metadata from within a trigger on auth.users is tricky.
    -- Usually, we recommend setting this during the signup process or via an admin function.
    -- However, we can use raw_app_meta_data for the role if needed.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
