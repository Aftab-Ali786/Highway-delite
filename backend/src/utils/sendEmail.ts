
import nodemailer from "nodemailer";

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Notes App",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP will expire in 5 minutes.</p>`
    });

    console.log(`✅ OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Could not send email");
  }
}
