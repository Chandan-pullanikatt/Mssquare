-- Create group_sessions table
CREATE TABLE IF NOT EXISTS public.group_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table for multiple instructors per session
CREATE TABLE IF NOT EXISTS public.group_session_instructors (
    session_id UUID REFERENCES public.group_sessions(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, instructor_id)
);

-- Enable RLS
ALTER TABLE public.group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_session_instructors ENABLE ROW LEVEL SECURITY;

-- Policies for group_sessions
DROP POLICY IF EXISTS "Admins can manage group_sessions" ON public.group_sessions;
CREATE POLICY "Admins can manage group_sessions" 
ON public.group_sessions FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('lms_admin', 'cms_admin')
    )
);

DROP POLICY IF EXISTS "Instructors can view their group_sessions" ON public.group_sessions;
CREATE POLICY "Instructors can view their group_sessions" 
ON public.group_sessions FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.group_session_instructors 
        WHERE group_session_instructors.session_id = group_sessions.id 
        AND group_session_instructors.instructor_id = auth.uid()
    )
);

-- Policies for group_session_instructors
DROP POLICY IF EXISTS "Admins can manage group_session_instructors" ON public.group_session_instructors;
CREATE POLICY "Admins can manage group_session_instructors" 
ON public.group_session_instructors FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('lms_admin', 'cms_admin')
    )
);

DROP POLICY IF EXISTS "Instructors can view their session links" ON public.group_session_instructors;
CREATE POLICY "Instructors can view their session links" 
ON public.group_session_instructors FOR SELECT TO authenticated 
USING (instructor_id = auth.uid());

-- Grant permissions
GRANT ALL ON public.group_sessions TO authenticated;
GRANT ALL ON public.group_sessions TO service_role;
GRANT ALL ON public.group_session_instructors TO authenticated;
GRANT ALL ON public.group_session_instructors TO service_role;
