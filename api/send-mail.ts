import { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// .env ファイルの読み込み
dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ error: "すべての項目を入力してください。" });
  }

  // Gmail SMTP 設定
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
    text: `以下の内容でお問い合わせがありました。\n\n名前: ${name}\nメール: ${email}\n\nメッセージ:\n${message}`,
  };

  // ユーザーへの自動返信
  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "【お問い合わせ受付】ご連絡ありがとうございます",
    text: `こんにちは、${name} 様\n\nお問い合わせありがとうございます。\n以下の内容で受け付けました。\n\n----------\n${message}\n----------\n\n通常24時間以内にご返信いたします。\n\nどうぞよろしくお願いいたします。\n\n[会社名 / サポートチーム]`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    console.log("✅ メール送信成功:", email);
    return res.status(200).json({ message: "メールを送信しました" });

  } catch (error) {
    console.error("❌ メール送信エラー:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
