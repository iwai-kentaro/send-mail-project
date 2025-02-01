import { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("📩 メール送信リクエストを受信:", req.method, req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, message } = req.body;
  if (!email || !name || !message) {
    return res.status(400).json({ error: "すべての項目を入力してください。" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "【お問い合わせ】新しいメッセージが届きました",
      text: `名前: ${name}\nメール: ${email}\nメッセージ:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "メールを送信しました" });

  } catch (error) {
    console.error("❌ メール送信エラー:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
