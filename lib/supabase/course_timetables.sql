-- CLEAN RECREATE SCRIPT FOR COURSE TIMETABLES
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Drop existing objects to ensure a clean state
DROP TRIGGER IF EXISTS update_course_timetables_updated_at ON public.course_timetables;
DROP TABLE IF EXISTS public.timetable_instructors CASCADE;
DROP TABLE IF EXISTS public.course_timetables CASCADE;

-- 2. Create the main table
CREATE TABLE public.course_timetables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, etc.
    scheduled_at DATE, -- Optional: for specific dates or recurring starting from
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create junction table for multiple instructors
CREATE TABLE public.timetable_instructors (
    timetable_id UUID REFERENCES public.course_timetables(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (timetable_id, instructor_id)
);

-- 4. Enable RLS
ALTER TABLE public.course_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_instructors ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Admins: Full access
CREATE POLICY "Admins full access" 
ON public.course_timetables FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('lms_admin', 'cms_admin')
    )
);

CREATE POLICY "Admins full access junction" 
ON public.timetable_instructors FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('lms_admin', 'cms_admin')
    )
);

-- Students: View enrolled course timetables
CREATE POLICY "Students view enrolled" 
ON public.course_timetables FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.student_enrollments 
        WHERE student_enrollments.course_id = course_timetables.course_id 
        AND student_enrollments.student_id = auth.uid()
    )
);

-- Instructors: View assigned timetables
CREATE POLICY "Instructors view assigned" 
ON public.course_timetables FOR SELECT TO authenticated 
USING (
    instructor_id = auth.uid()
    OR 
    EXISTS (
        SELECT 1 FROM public.timetable_instructors
        WHERE timetable_instructors.timetable_id = course_timetables.id
        AND timetable_instructors.instructor_id = auth.uid()
    )
    OR 
    EXISTS (
        SELECT 1 FROM public.courses
        WHERE courses.id = course_timetables.course_id
        AND courses.instructor_id = auth.uid()
    )
);

-- 6. Trigger for updated_at
-- This function should already exist from schema_cms.sql
CREATE TRIGGER update_course_timetables_updated_at 
BEFORE UPDATE ON public.course_timetables 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Grant permissions
GRANT ALL ON public.course_timetables TO authenticated;
GRANT ALL ON public.course_timetables TO service_role;
GRANT ALL ON public.timetable_instructors TO authenticated;
GRANT ALL ON public.timetable_instructors TO service_role;

-- 8. Final check: Notify PostgREST to reload schema (automatic in Supabase usually)
-- But sometimes a dummy query helps.
SELECT * FROM public.course_timetables LIMIT 0;
