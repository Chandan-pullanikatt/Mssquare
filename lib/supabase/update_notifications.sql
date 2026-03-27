-- Update notifications table constraint to allow admin roles
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_target_role_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_target_role_check 
CHECK (target_role IN ('student', 'business_client', 'cms_admin', 'lms_admin', 'business_admin', 'all'));
