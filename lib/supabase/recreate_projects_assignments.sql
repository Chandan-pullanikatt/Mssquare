-- Drop and Recreate Projects and Assignments tables to apply the new schema

-- We need to drop tables that depend on them first, or use CASCADE
DROP TABLE IF EXISTS public.project_submissions CASCADE;
DROP TABLE IF EXISTS public.project_team_members CASCADE;
DROP TABLE IF EXISTS public.project_milestones CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.assignment_rubric CASCADE;

-- Drop the main tables
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;

-- Now create them with the new schema

CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    available_from TIMESTAMPTZ,
    pass_mark INTEGER,
    max_marks INTEGER,
    max_attempts INTEGER,
    allow_late BOOLEAN DEFAULT false,
    allowed_types TEXT[],
    max_file_mb INTEGER,
    peer_review BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.assignment_rubric (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    criterion TEXT NOT NULL,
    max_marks INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status submission_status DEFAULT 'pending',
    content TEXT,
    file_url TEXT,
    annotated_url TEXT,
    attempt_number INTEGER DEFAULT 1,
    marks_awarded INTEGER,
    graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_type project_type DEFAULT 'solo',
    team_size_min INTEGER,
    team_size_max INTEGER,
    cert_credit BOOLEAN DEFAULT false,
    tech_tags TEXT[],
    resources JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.project_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    marks INTEGER,
    requires_sub BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.project_team_members (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE public.project_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone_id UUID NOT NULL REFERENCES public.project_milestones(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status submission_status DEFAULT 'pending',
    content TEXT,
    file_url TEXT,
    marks_awarded INTEGER,
    graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Re-apply RLS Policies
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_rubric ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Assignments RLS
CREATE POLICY "Enable read access for enrolled students" ON "public"."assignments" AS PERMISSIVE FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.student_enrollments se WHERE se.course_id = assignments.course_id AND se.student_id = auth.uid()));
CREATE POLICY "Enable full access for admins" ON "public"."assignments" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Assignment Rubric RLS
CREATE POLICY "Enable read access for enrolled students" ON "public"."assignment_rubric" AS PERMISSIVE FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.assignments a JOIN public.student_enrollments se ON a.course_id = se.course_id WHERE a.id = assignment_rubric.assignment_id AND se.student_id = auth.uid()));
CREATE POLICY "Enable full access for admins" ON "public"."assignment_rubric" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Submissions RLS
CREATE POLICY "Students can manage their own submissions" ON "public"."submissions" AS PERMISSIVE FOR ALL TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Enable full access for admins" ON "public"."submissions" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Projects RLS
CREATE POLICY "Enable read access for enrolled students" ON "public"."projects" AS PERMISSIVE FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.student_enrollments se WHERE se.course_id = projects.course_id AND se.student_id = auth.uid()));
CREATE POLICY "Enable full access for admins" ON "public"."projects" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Project Milestones RLS
CREATE POLICY "Enable read access for enrolled students" ON "public"."project_milestones" AS PERMISSIVE FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.student_enrollments se ON p.course_id = se.course_id WHERE p.id = project_milestones.project_id AND se.student_id = auth.uid()));
CREATE POLICY "Enable full access for admins" ON "public"."project_milestones" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Project Team Members RLS
CREATE POLICY "Students can view their own team membership" ON "public"."project_team_members" AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Enable full access for admins" ON "public"."project_team_members" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));

-- Project Submissions RLS
CREATE POLICY "Students can manage their own project submissions" ON "public"."project_submissions" AS PERMISSIVE FOR ALL TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Enable full access for admins" ON "public"."project_submissions" AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'lms_admin'));
