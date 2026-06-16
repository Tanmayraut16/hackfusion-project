// utils/emailServiceOTP.js
import { sendEmail } from "./emailService.js";

// Store OTPs temporarily
const otpStore = new Map();

// Generate OTP
export const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });

  return otp;
};

// Send OTP email
export const sendOTPEmail = async (to) => {
  const otp = generateOTP(to);

  const subject = "Your Voting OTP";
  const text = `Your OTP is ${otp}. Valid for 5 minutes.`;

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Your OTP is ${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    </div>
  `;

  const result = await sendEmail(to, subject, text, html);

  if (!result.success) {
    // ❗ Remove OTP if email failed
    otpStore.delete(to);
    return { success: false };
  }

  console.log(`OTP sent to ${to}`);
  return { success: true };
};

// Verify OTP
export const verifyOTP = (email, otp) => {
  const stored = otpStore.get(email);

  if (!stored) return false;

  if (stored.expiresAt < Date.now()) {
    otpStore.delete(email);
    return false;
  }

  if (stored.otp !== otp) return false;

  otpStore.delete(email);
  return true;
};