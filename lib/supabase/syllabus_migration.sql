-- Migration: Add syllabus_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS syllabus_url TEXT;
