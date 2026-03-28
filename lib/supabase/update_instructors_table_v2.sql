-- Migration: Add status and remarks to instructors table
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'invited',
ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Update existing instructors to active 
UPDATE public.instructors SET status = 'active' WHERE status IS NULL;
