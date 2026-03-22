-- 1. Enable RLS on student_enrollments
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- 2. Allow students to view their own enrollments
DROP POLICY IF EXISTS "Students can view their own enrollments" ON public.student_enrollments;
CREATE POLICY "Students can view their own enrollments" ON public.student_enrollments
FOR SELECT TO authenticated
USING (student_id = auth.uid());

-- 3. Allow admins to manage all enrollments
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.student_enrollments;
CREATE POLICY "Admins can manage all enrollments" ON public.student_enrollments
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('lms_admin', 'business_admin')
  )
);
