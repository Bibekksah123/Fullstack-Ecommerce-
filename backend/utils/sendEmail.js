const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw new Error('Email could not be sent');
  }
};

const emailTemplates = {
  verifyEmail: (name, url) => ({
    subject: 'Verify Your ShopNow Email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#FF6B35;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0">ShopNow</h1>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 8px 8px">
          <h2>Hi ${name}! 👋</h2>
          <p>Thanks for signing up! Please verify your email address to get started.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${url}" style="background:#FF6B35;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold">
              Verify Email
            </a>
          </div>
          <p style="color:#666;font-size:14px">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  resetPassword: (name, url) => ({
    subject: 'Reset Your ShopNow Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#FF6B35;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0">ShopNow</h1>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 8px 8px">
          <h2>Hi ${name}!</h2>
          <p>You requested a password reset. Click the button below to reset it.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${url}" style="background:#FF6B35;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold">
              Reset Password
            </a>
          </div>
          <p style="color:#666;font-size:14px">This link expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (name, orderNumber, total) => ({
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#FF6B35;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0">ShopNow</h1>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 8px 8px">
          <h2>🎉 Order Confirmed!</h2>
          <p>Hi ${name}, your order has been placed successfully.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> Rs. ${total}</p>
          <p>You'll receive updates as your order progresses.</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
