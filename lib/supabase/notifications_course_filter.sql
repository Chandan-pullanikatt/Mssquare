-- Add course_id column to notifications
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- Update RLS policies for course-based targeting
-- Drop the old policy first
DROP POLICY IF EXISTS "Users can read targeted notifications" ON public.notifications;

-- New policy that accounts for course enrollment
CREATE POLICY "Users can read targeted notifications" 
ON public.notifications
FOR SELECT
USING (
    target_role = 'all' OR 
    (target_role = (SELECT role FROM public.profiles WHERE profiles.id = auth.uid()) 
     AND (course_id IS NULL OR EXISTS (
         SELECT 1 FROM public.student_enrollments 
         WHERE student_enrollments.student_id = auth.uid() 
         AND student_enrollments.course_id = notifications.course_id
     )))
);
