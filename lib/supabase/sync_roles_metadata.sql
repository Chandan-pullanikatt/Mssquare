-- 1. Sync existing roles to auth.users app_metadata
-- This allows the middleware to check roles directly from the JWT without a database hit.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT id, role FROM public.profiles) LOOP
    UPDATE auth.users 
    SET raw_app_meta_data = 
      jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb), 
        '{role}', 
        to_jsonb(r.role)
      )
    WHERE id = r.id;
  END LOOP;
END $$;

-- 2. Create a trigger to keep roles in sync automatically
-- This ensures that any future role changes are immediately reflected in the JWT.
CREATE OR REPLACE FUNCTION public.sync_role_to_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users 
  SET raw_app_meta_data = 
    jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb), 
      '{role}', 
      to_jsonb(NEW.role)
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_role_change ON public.profiles;
CREATE TRIGGER on_role_change
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.sync_role_to_metadata();
