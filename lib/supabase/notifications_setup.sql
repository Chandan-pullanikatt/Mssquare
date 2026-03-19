-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_role TEXT NOT NULL CHECK (target_role IN ('student', 'business_client', 'all')),
    sender_id UUID REFERENCES auth.users(id),
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Admins can do everything
CREATE POLICY "Admins can manage all notifications" 
ON public.notifications
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'lms_admin' OR profiles.role = 'business_admin' OR profiles.role = 'cms_admin')
    )
);

-- 2. Users can read notifications targeted at their role or 'all'
CREATE POLICY "Users can read targeted notifications" 
ON public.notifications
FOR SELECT
USING (
    target_role = 'all' OR 
    target_role = (SELECT role FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Grant permissions
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
