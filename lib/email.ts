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
  return resendClient.emails.send({
    from: 'MSSquare HR <hr@mssquaretechnologies.com>',
    to: [email],
    subject: subject,
    html: content,
  });
};
