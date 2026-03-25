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
      <h1>Hello ${name},</h1>
      <p>Thank you for applying to join the team at MSSquare!</p>
      <p>We have received your application and resume. Our recruitment team will review your profile and get back to you within 48 hours.</p>
      <p>Best regards,<br/>The MSSquare Team</p>
    `
    : `
      <h1>Hello ${name},</h1>
      <p>Thank you for your interest in becoming an instructor at MSSquare!</p>
      <p>We have received your details and resume. Our academic team will review your expertise and reach out to discuss potential opportunities.</p>
      <p>Best regards,<br/>The MSSquare Team</p>
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
      <h1 style="color: #7C3AED;">Hello ${name},</h1>
      <p>Thank you for reaching out to **MSSquare Studio**! We've received your inquiry and our solution architects are already reviewing your project details.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin: 20px 0;">
        <h3 style="margin-top: 0;">Next Steps:</h3>
        <p>To provide you with a faster and more detailed technical proposal, we recommend creating a project in our **Business Client Portal**.</p>
        <p>In the portal, you can:</p>
        <ul>
          <li>Submit detailed project requirements</li>
          <li>Track development milestones</li>
          <li>Communication directly with your assigned experts</li>
        </ul>
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
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #7C3AED; margin-bottom: 10px;">Welcome to MSSquare!</h1>
        <p style="font-size: 1.1em; color: #666;">We're excited to help you find the right path in our ecosystem.</p>
      </div>
      
      <p>Based on your interest, here are the three main ways you can grow with us:</p>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #7C3AED; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">🎓 Training & Learning</h3>
        <p>Master industry-standard skills with our curated courses. From development to design, we've got you covered.</p>
        <a href="https://mssquaretechnologies.com/courses" style="color: #7C3AED; font-weight: bold; text-decoration: none;">Explore Courses &rarr;</a>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #7C3AED; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">💼 Careers & Internships</h3>
        <p>Looking to join our team or start your career journey? Check out our open roles and internship programs.</p>
        <a href="https://mssquaretechnologies.com/careers" style="color: #7C3AED; font-weight: bold; text-decoration: none;">View Open Roles &rarr;</a>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #7C3AED; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">🚀 Business Consultancy</h3>
        <p>Have a product idea? Our software studio helps startups and businesses build scalable digital products.</p>
        <a href="https://mssquaretechnologies.com/web-services" style="color: #7C3AED; font-weight: bold; text-decoration: none;">Start a Project &rarr;</a>
      </div>

      <div style="background: #fdfafd; padding: 20px; border-radius: 12px; border: 1px solid #fae8ff; text-align: center;">
        <p style="margin: 0; font-weight: bold;">Not sure where to start?</p>
        <p style="margin: 5px 0 15px;">Our experts will reach out to you shortly for a free consultation.</p>
      </div>

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
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: #7C3AED; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">Update from MSSquare</h1>
      </div>
      
      <div style="padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
        <p>Hello ${name},</p>
        <p>Regarding your enquiry "**${enquirySubject}**":</p>
        
        <div style="background: #fdfafd; padding: 20px; border-radius: 12px; border: 1px solid #fae8ff; margin: 25px 0; font-weight: bold; color: #4B5563; text-align: center;">
          ${message}
        </div>

        <div style="text-align: center;">
          <a href="https://mssquaretechnologies.com/business/dashboard" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Details in Dashboard</a>
        </div>
        
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #999;">
          Best regards,<br/>
          **The MSSquare Team**
        </p>
      </div>
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
