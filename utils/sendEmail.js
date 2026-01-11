import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: subject,
      text: message, // Fallback plain text
      // You can also add React email templates here later
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`, 
    });

    if (data.error) {
        throw new Error(data.error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Resend Error:', error);
    throw new Error('Failed to send email via Resend');
  }
};

export default sendEmail;