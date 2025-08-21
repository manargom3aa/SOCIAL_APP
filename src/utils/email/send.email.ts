import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: subject || "Confirm Your Email",
    text: text || "Please confirm your email",
    html: html || `<p>Please confirm your email</p>`,
  });
};
