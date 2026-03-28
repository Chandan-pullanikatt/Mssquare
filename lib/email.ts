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
    from: 'MSSquare HR <hr@mssquaretechnologies.com>',
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
    from: 'MSSquare Studio <hello@mssquaretechnologies.com>',
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
  const subject = "Welcome to MSSquare - Let's find your perfect match!";
  const content = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      <p>Hello,</p>
      <p>Welcome to **MSSquare**! We're excited to help you find the right path in our ecosystem.</p>
      
      <p>Based on your interest, here are the main ways you can grow with us:</p>

      <div style="margin: 20px 0;">
        <strong>🎓 Training & Learning</strong><br/>
        Master industry-standard skills with our curated courses.<br/>
        <a href="https://mssquaretechnologies.com/courses" style="color: #7C3AED; font-weight: bold; text-decoration: none;">Explore Courses &rarr;</a>
      </div>

      <div style="margin: 20px 0;">
        <strong>💼 Careers & Internships</strong><br/>
        Looking to join our team or start your journey? Check out our open roles.<br/>
        <a href="https://mssquaretechnologies.com/careers" style="color: #7C3AED; font-weight: bold; text-decoration: none;">View Open Roles &rarr;</a>
      </div>

      <div style="margin: 20px 0;">
        <strong>🚀 Business Consultancy</strong><br/>
        Have a product idea? Our software studio helps startups build digital products.<br/>
        <a href="https://mssquaretechnologies.com/web-services" style="color: #7C3AED; font-weight: bold; text-decoration: none;">Start a Project &rarr;</a>
      </div>

      <p style="margin-top: 30px;">
        Not sure where to start? Our experts will reach out to you shortly for a free consultation.
      </p>

      <p style="margin-top: 30px; font-size: 0.9em; color: #999;">
        Best regards,<br/>
        **The MSSquare Team**
      </p>
    </div>
  `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'MSSquare <hr@mssquaretechnologies.com>',
    to: [email],
    subject: subject,
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
    from: 'MSSquare Support <support@mssquaretechnologies.com>',
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
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #7C3AED; color: white; padding: 12px; border-radius: 16px; margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4-4-4"/><path d="M3.34 7a10 10 0 1 1 17.32 10"/></svg>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin: 0;">Welcome to MSSquare Academy</h1>
      </div>

      <p>Hello,</p>
      <p>You've been officially invited to join the **MSSquare Academy** faculty as an instructor. We're excited to have your expertise on board!</p>
      
      <div style="background: #f9fafb; padding: 32px; border-radius: 24px; border: 1px solid #f3f4f6; margin: 32px 0; text-align: center;">
        <p style="margin-bottom: 24px; font-weight: 600;">To get started, please accept your invitation and set up your secure account credentials:</p>
        <a href="${inviteLink}" style="display: inline-block; background: #7C3AED; color: white; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: bold; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);">Accept Invitation</a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">If you have any questions before accepting, please contact our academic team.</p>
      
      <p style="margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 24px; font-size: 14px; color: #9ca3af; text-align: center;">
        Best regards,<br/>
        **The MSSquare Academic Team**
      </p>
    </div>
  `;

  const resendClient = getResendClient();
  const { data, error } = await resendClient.emails.send({
    from: 'MSSquare Academy <academy@mssquaretechnologies.com>',
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
