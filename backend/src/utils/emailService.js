import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail ID
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password
  },
});

// Function to send email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "MediCare System",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};
