-- Performance Indexes for MSSquare Platform (Safe Version)

DO $$
BEGIN
    -- 1. Enrollments
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enrollments') THEN
        CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
        CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
        
        -- Check if enrolled_at exists (common name in this schema)
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'enrolled_at') THEN
            CREATE INDEX IF NOT EXISTS idx_enrollments_user_enrolled_at ON public.enrollments(user_id, enrolled_at DESC);
        ELSIF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'created_at') THEN
            CREATE INDEX IF NOT EXISTS idx_enrollments_user_created_at ON public.enrollments(user_id, created_at DESC);
        END IF;
    END IF;

    -- 2. Lessons
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
        CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
    END IF;

    -- 3. Projects
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_course_id ON public.projects(course_id);
    END IF;

    -- 4. Business Projects
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_projects') THEN
        CREATE INDEX IF NOT EXISTS idx_business_projects_user_id ON public.business_projects(user_id);
    END IF;

    -- 5. Student Enrollments
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_enrollments') THEN
        CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON public.student_enrollments(student_id);
        CREATE INDEX IF NOT EXISTS idx_student_enrollments_course_id ON public.student_enrollments(course_id);
    END IF;

    -- 6. Messages (Optional Table)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
        CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
    END IF;

    -- 7. Notifications (Optional Table)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
    END IF;

    -- 8. Payments (Optional Table)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
        CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
    END IF;

    -- 9. Profiles (Common)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE INDEX IF NOT EXISTS idx_profiles_user_created_at ON public.profiles(id, created_at DESC);
    END IF;
END $$;
