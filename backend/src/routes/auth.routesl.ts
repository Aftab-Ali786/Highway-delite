import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { OTP } from "../models/otp.model";
import { sendOtpEmail } from "../utils/sendEmail";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, emailVerified: false });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60000) });

  await sendOtpEmail(email, otp);
  res.json({ message: "OTP sent to your email" });
});


router.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const record = await OTP.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  await User.updateOne({ email }, { $set: { emailVerified: true } });
  res.json({ message: "Email verified successfully" });
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (!user.emailVerified) {
    return res.status(400).json({ error: "Email not verified" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
