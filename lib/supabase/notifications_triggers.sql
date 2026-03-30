-- 1. Update Notifications Table Constraints
-- Add support for admin roles in target_role
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_target_role_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_target_role_check 
CHECK (target_role IN ('student', 'business_client', 'cms_admin', 'lms_admin', 'business_admin', 'all'));

-- 2. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_admin_notification()
RETURNS TRIGGER AS $$
DECLARE
    notif_title TEXT;
    notif_message TEXT;
    notif_target TEXT := 'cms_admin'; -- Default target for CEO/CMS Admin
    notif_type TEXT := 'info';
BEGIN
    -- Determine Title and Message based on the source table
    IF TG_TABLE_NAME = 'leads' THEN
        notif_title := 'New Website Lead';
        notif_message := 'Received a new lead from ' || COALESCE(NEW.name, 'Anonymous') || ' (' || COALESCE(NEW.source, 'Inquiry') || ')';
        notif_type := 'success';
        
    ELSIF TG_TABLE_NAME = 'webservice_enquiries' THEN
        notif_title := 'New Business Enquiry';
        notif_message := 'New enquiry from ' || COALESCE(NEW.full_name, 'Anonymous') || ' regarding ' || COALESCE(NEW.project_type, 'Project');
        notif_type := 'info';

    ELSIF TG_TABLE_NAME = 'career_applications' THEN
        notif_title := 'New Career Application';
        notif_message := COALESCE(NEW.full_name, 'Someone') || ' applied for ' || COALESCE(NEW.position, 'a position');
        notif_type := 'warning';

    ELSIF TG_TABLE_NAME = 'instructor_applications' THEN
        notif_title := 'New Instructor Application';
        notif_message := COALESCE(NEW.full_name, 'Someone') || ' applied as an Instructor';
        notif_type := 'warning';

    ELSIF TG_TABLE_NAME = 'enrollments' OR TG_TABLE_NAME = 'student_enrollments' THEN
        notif_title := 'New Student Enrollment';
        notif_message := 'A new student has enrolled in a course.';
        notif_type := 'success';
    END IF;

    -- Insert the notification
    INSERT INTO public.notifications (title, message, target_role, type, created_at)
    VALUES (notif_title, notif_message, notif_target, notif_type, NOW());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Triggers for each table
-- Drop existing triggers if any to prevent duplicates
DROP TRIGGER IF EXISTS tr_new_lead_notification ON public.leads;
CREATE TRIGGER tr_new_lead_notification
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();

DROP TRIGGER IF EXISTS tr_new_enquiry_notification ON public.webservice_enquiries;
CREATE TRIGGER tr_new_enquiry_notification
AFTER INSERT ON public.webservice_enquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();

DROP TRIGGER IF EXISTS tr_new_career_app_notification ON public.career_applications;
CREATE TRIGGER tr_new_career_app_notification
AFTER INSERT ON public.career_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();

DROP TRIGGER IF EXISTS tr_new_instructor_app_notification ON public.instructor_applications;
CREATE TRIGGER tr_new_instructor_app_notification
AFTER INSERT ON public.instructor_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();

DROP TRIGGER IF EXISTS tr_new_enrollment_notification ON public.enrollments;
CREATE TRIGGER tr_new_enrollment_notification
AFTER INSERT ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();

DROP TRIGGER IF EXISTS tr_new_student_enrollment_notification ON public.student_enrollments;
CREATE TRIGGER tr_new_student_enrollment_notification
AFTER INSERT ON public.student_enrollments
FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_notification();
