-- Add status and remarks to instructors table
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
ADD COLUMN IF NOT EXISTS remarks TEXT;
