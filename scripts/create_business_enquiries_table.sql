-- Create business_enquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.business_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.business_projects(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'In Progress')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add reply columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='business_enquiries' AND column_name='admin_reply') THEN
        ALTER TABLE public.business_enquiries ADD COLUMN admin_reply TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='business_enquiries' AND column_name='replied_at') THEN
        ALTER TABLE public.business_enquiries ADD COLUMN replied_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.business_enquiries ENABLE ROW LEVEL SECURITY;

-- Safely recreate policies
DROP POLICY IF EXISTS "Users can view their own enquiries" ON public.business_enquiries;
CREATE POLICY "Users can view their own enquiries" ON public.business_enquiries
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own enquiries" ON public.business_enquiries;
CREATE POLICY "Users can insert their own enquiries" ON public.business_enquiries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and update all enquiries" ON public.business_enquiries;
CREATE POLICY "Admins can view and update all enquiries" ON public.business_enquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND (role = 'business_admin' OR role = 'cms_admin' OR role = 'lms_admin')
        )
    );
