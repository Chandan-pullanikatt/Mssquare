-- 1. Fix student_enrollments RLS (Missing policy)
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own enrollments" ON public.student_enrollments;
CREATE POLICY "Students can view their own enrollments" ON public.student_enrollments
FOR SELECT TO authenticated
USING (student_id = auth.uid());

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

-- 2. Fix recorded_sessions RLS (Was using wrong table 'enrollments')
DROP POLICY IF EXISTS "Students can view recordings for their enrollments" ON public.recorded_sessions;
CREATE POLICY "Students can view recordings for their enrollments" ON public.recorded_sessions
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.student_enrollments
    WHERE student_enrollments.student_id = auth.uid()
    AND student_enrollments.course_id = recorded_sessions.course_id
    AND student_enrollments.payment_status = 'success'
  )
);

-- 3. Ensure admins can manage recordings
DROP POLICY IF EXISTS "Admins can manage recordings via JWT role" ON public.recorded_sessions;
CREATE POLICY "Admins can manage recordings via JWT role" ON public.recorded_sessions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('lms_admin', 'business_admin')
  )
);
