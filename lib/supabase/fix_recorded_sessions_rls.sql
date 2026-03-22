-- Fix RLS policies for recorded_sessions and session_views
-- The previous policies were checking auth.jwt()->>'role', but the role is stored in app_metadata.

-- 1. recorded_sessions policies
DROP POLICY IF EXISTS "Admins can manage recordings via JWT role" ON recorded_sessions;
CREATE POLICY "Admins can manage recordings via JWT role" ON recorded_sessions
    FOR ALL TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' IN ('lms_admin', 'cms_admin'))
        OR
        (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('lms_admin', 'cms_admin')))
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role' IN ('lms_admin', 'cms_admin'))
        OR
        (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('lms_admin', 'cms_admin')))
    );

-- 2. session_views policies (ensure admins can view all)
DROP POLICY IF EXISTS "Admins can view all session analytics" ON session_views;
CREATE POLICY "Admins can view all session analytics" ON session_views
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' IN ('lms_admin', 'cms_admin'))
        OR
        (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('lms_admin', 'cms_admin')))
    );

-- 3. Ensure students can still view recordings if they have active enrollment
-- (This policy should already be correct, but we'll reinforce it)
DROP POLICY IF EXISTS "Students can view recordings for their enrollments" ON recorded_sessions;
CREATE POLICY "Students can view recordings for their enrollments" ON recorded_sessions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE enrollments.user_id = auth.uid()
            AND enrollments.course_id = recorded_sessions.course_id
            AND enrollments.status = 'active'
        )
    );
