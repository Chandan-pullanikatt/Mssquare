import { Resend } from 'resend';

let resend: Resend | null = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey && process.env.NODE_ENV === 'production') {
      console.warn('RESEND_API_KEY is missing in production environment');
    }
    resend = new Resend(apiKey || 're_stub'); // Use stub for build time if missing
  }
  return resend;
};

export const sendApplicationConfirmation = async ({
  email,
  name,
  type
}: {
  email: string;
  name: string;
  type: 'career' | 'instructor';
}) => {
  const subject = type === 'career' 
    ? "Application Received - MSSquare Careers" 
    : "Interest Received - Become an Instructor at MSSquare";
  
  const content = type === 'career' 
    ? `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hello ${name},</p>
        <p>Thank you for applying to join the team at **MSSquare**!</p>
        <p>We've successfully received your application. Our recruitment team will review your profile and reach out within 48 hours.</p>
        <p>Best regards,<br/>**The MSSquare Team**</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">MSSquare Technologies - Building the Future of Innovation</p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333 text-align: left;">
        <p>Hello ${name},</p>
        <p>Thank you for your interest in becoming an instructor at **MSSquare**!</p>
        <p>Our academic team is currently reviewing your expertise and will reach out shortly to discuss potential opportunities.</p>
        <p>Best regards,<br/>**The MSSquare Team**</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">MSSquare Academy - Empowering Minds</p>
      </div>
    `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'Pagidipalli Sai Santosh from MSSquare <hr@mssquaretechnologies.com>',
    replyTo: 'support@mssquaretechnologies.com',
    to: [email],
    subject: subject,
    html: content,
  });

  if (error) {
    console.error('Resend Error (Application):', error);
    throw new Error(error.message);
  }
  return data;
};

export const sendEnquiryConfirmation = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const subject = "Project Inquiry Received - MSSquare Studio";
  const content = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <p>Hello ${name},</p>
      <p>Thank you for reaching out to **MSSquare Studio**! We've received your query and our solution architects are already reviewing your project details.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin: 20px 0;">
        <p><strong>Next Steps:</strong></p>
        <p>To provide you with a faster and more detailed technical proposal, we recommend creating a project in our **Business Client Portal**.</p>
        <a href="https://mssquaretechnologies.com/auth?portal=business_client" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Create portal account</a>
      </div>

      <p>Alternatively, we will contact you via email shortly to schedule a discovery call.</p>
      <p>Best regards,<br/>**The MSSquare Studio Team**</p>
    </div>
  `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'Pagidipalli Sai Santosh from MSSquare <hello@mssquaretechnologies.com>',
    replyTo: 'support@mssquaretechnologies.com',
    to: [email],
    subject: subject,
    html: content,
  });

  if (error) {
    console.error('Resend Error (Enquiry):', error);
    throw new Error(error.message);
  }
  return data;
};

export const sendMatchWelcome = async ({
  email
}: {
  email: string;
}) => {
  const subject = "Welcome to MSSquare";
  const content = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
      <p>Hello,</p>
      <p>Welcome to **MSSquare**! I'm glad you've joined our community.</p>
      
      <p>Whether you're looking for industry-standard training, career opportunities, or technical consultancy, we're here to help you grow.</p>

      <p style="margin: 24px 0;">
        <strong>Quick Links to Get Started:</strong><br/>
        • <a href="https://mssquaretechnologies.com/courses" style="color: #7C3AED; text-decoration: none;">Explore Our Courses</a><br/>
        • <a href="https://mssquaretechnologies.com/careers" style="color: #7C3AED; text-decoration: none;">View Open Career Roles</a><br/>
        • <a href="https://mssquaretechnologies.com/web-services" style="color: #7C3AED; text-decoration: none;">Start a Business Project</a>
      </p>

      <p>If you're not sure where to start, just reply to this email! One of our experts will reach out to you shortly for a free consultation.</p>

      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        Best regards,<br/>
        <strong>Pagidipalli Sai Santosh</strong><br/>
        <span style="color: #666; font-size: 0.9em;">MSSquare Team</span>
      </p>
    </div>
  `;

  const textContent = `
Hello,

Welcome to MSSquare! I'm glad you've joined our community.

Whether you're looking for industry-standard training, career opportunities, or technical consultancy, we're here to help you grow.

Quick Links to Get Started:
- Explore Our Courses: https://mssquaretechnologies.com/courses
- View Open Career Roles: https://mssquaretechnologies.com/careers
- Start a Business Project: https://mssquaretechnologies.com/web-services

If you're not sure where to start, just reply to this email! One of our experts will reach out to you shortly for a free consultation.

Best regards,
Pagidipalli Sai Santosh
MSSquare Team
  `.trim();

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'Pagidipalli Sai Santosh from MSSquare <hr@mssquaretechnologies.com>',
    replyTo: 'support@mssquaretechnologies.com',
    to: [email],
    subject: subject,
    text: textContent,
    html: content,
  });

  if (error) {
    console.error('Resend Error (Match):', error);
    throw new Error(error.message);
  }
  return data;
};

export const sendEnquiryReply = async ({
  email,
  name,
  subject: enquirySubject,
  isResolved,
}: {
  email: string;
  name: string;
  subject: string;
  isResolved?: boolean;
}) => {
  const subject = `Update on your enquiry: ${enquirySubject}`;
  const message = isResolved 
    ? "Your current issue has been solved. Please check your dashboard for details." 
    : "We have updated your enquiry with some more information or questions. Please see your dashboard to respond.";
    
  const content = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      <p>Hello ${name},</p>
      <p>Regarding your enquiry "**${enquirySubject}**":</p>
      
      <p style="background: #fdfafd; padding: 20px; border-radius: 12px; border: 1px solid #fae8ff; margin: 25px 0; font-weight: bold; color: #4B5563;">
        ${message}
      </p>

      <div style="text-align: left;">
        <a href="https://mssquaretechnologies.com/business/dashboard" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Details in Dashboard</a>
      </div>
      
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #999;">
        Best regards,<br/>
        **The MSSquare Team**
      </p>
    </div>
  `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'Pagidipalli Sai Santosh from MSSquare <support@mssquaretechnologies.com>',
    replyTo: 'support@mssquaretechnologies.com',
    to: [email],
    subject: subject,
    html: content,
  });

  if (error) {
    console.error('Resend Error (Enquiry Update):', error);
    throw new Error(error.message);
  }
  return data;
};

export const sendInstructorInvitation = async ({
  email,
  inviteLink,
}: {
  email: string;
  inviteLink: string;
}) => {
  const subject = "Invitation to Join MSSquare Academy Faculty";
  const content = `
    <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: left; margin-bottom: 24px;">
        <h1 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0;">Faculty Invitation</h1>
      </div>

      <p>Hello,</p>
      <p>You've been invited to join the mssquaretechnology faculty as an instructor. We're excited to have you on board!</p>
      
      <div style="background: #fdfafd; padding: 24px; border-radius: 12px; border: 1px solid #7C3AED10; margin: 24px 0;">
        <p style="margin-bottom: 20px;">Please click the button below to accept your invitation and set up your account password:</p>
        <a href="${inviteLink}" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Accept Invitation</a>
      </div>

      <p style="font-size: 13px; color: #6b7280;">If you have any questions, please contact our academic team.</p>
      
      <p style="margin-top: 32px; border-top: 1px solid #eee; padding-top: 20px; font-size: 13px; color: #9ca3af;">
        Best regards,<br/>
        mssquaretechnology Team
      </p>
    </div>
  `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'Pagidipalli Sai Santosh from MSSquare <academy@mssquaretechnologies.com>',
    replyTo: 'support@mssquaretechnologies.com',
    to: [email],
    subject: subject,
    html: content,
  });

  if (error) {
    console.error('Resend Error (Instructor Invitation):', error);
    throw new Error(error.message);
  }
  return data;
};
