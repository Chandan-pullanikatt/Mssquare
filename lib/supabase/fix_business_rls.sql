-- SQL Script to fix Business Portal RLS Policies
-- Execute this in the Supabase SQL Editor

-- 1. Enable RLS on business-related tables
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultancy_services ENABLE ROW LEVEL SECURITY;

-- 2. Service Requests Policies
-- Allow users to insert their own requests
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.service_requests;
CREATE POLICY "Users can insert their own requests" 
ON public.service_requests FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.service_requests;
CREATE POLICY "Users can view their own requests" 
ON public.service_requests FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to view and manage all requests
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.service_requests;
CREATE POLICY "Admins can manage all requests" 
ON public.service_requests FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.role IN ('lms_admin', 'business_admin', 'cms_admin')
    )
);

-- 3. Business Projects Policies
-- Allow users to view their own projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.business_projects;
CREATE POLICY "Users can view their own projects" 
ON public.business_projects FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to manage all projects
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.business_projects;
CREATE POLICY "Admins can manage all projects" 
ON public.business_projects FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.role IN ('lms_admin', 'business_admin', 'cms_admin')
    )
);

-- 4. Consultancy Services Policies
-- Allow everyone to view services
DROP POLICY IF EXISTS "Anyone can view services" ON public.consultancy_services;
CREATE POLICY "Anyone can view services" 
ON public.consultancy_services FOR SELECT 
TO authenticated
USING (true);
