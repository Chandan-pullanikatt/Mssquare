-- Link group_session_instructors to public.profiles instead of auth.users
-- This enables PostgREST to join the tables correctly for the API

ALTER TABLE public.group_session_instructors 
DROP CONSTRAINT IF EXISTS group_session_instructors_instructor_id_fkey;

ALTER TABLE public.group_session_instructors 
ADD CONSTRAINT group_session_instructors_instructor_id_fkey 
FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also verify course_timetables
ALTER TABLE public.course_timetables 
DROP CONSTRAINT IF EXISTS course_timetables_instructor_id_fkey;

ALTER TABLE public.course_timetables 
ADD CONSTRAINT course_timetables_instructor_id_fkey 
FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
