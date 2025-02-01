import { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "全ての項目を入力してください。" });
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
      text: `名前: ${name}\nメール: ${email}\n\nメッセージ:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "メールを送信しました" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({ error: "メール送信に失敗しました。" });
  }
}
