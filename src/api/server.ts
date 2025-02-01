import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

// .env ファイルの読み込み
dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "http://localhost:5173";
const app = express();

// ✅ CORS 設定（`bodyParser.json()` より前に定義）
app.use(
  cors({
    origin: HOST,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // クッキーや認証情報を含める場合に必要
  })
);



// JSON パース設定
app.use(bodyParser.json());

// Gmail SMTP 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


app.post("/api/send-email", async (req, res) => {
    console.log("📨 メール送信リクエスト:", req.body); // デバッグ用ログ
    const { email, name, message } = req.body;

  
    const mailOptions = {
        from: process.env.GMAIL_USER, // 送信元（Gmail アカウント）
        to: process.env.GMAIL_USER, // ✅ 送信先を「自分のメール」に変更
        subject: "【お問い合わせ】新しいメッセージが届きました",
        text: `以下の内容でお問い合わせがありました。\n\n名前: ${name}\nメール: ${email}\n\nメッセージ:\n${message}`,
      };

        // ✅ ユーザーへの「自動返信メール」
  const userMailOptions = {
    from: process.env.GMAIL_USER, // 送信元
    to: email, // ✅ ユーザーの入力したメールアドレス
    subject: "【お問い合わせ受付】ご連絡ありがとうございます",
    text: `こんにちは、${name} 様\n\nお問い合わせありがとうございます。\n以下の内容で受け付けました。\n\n----------\n${message}\n----------\n\n通常24時間以内にご返信いたします。\n\nどうぞよろしくお願いいたします。\n\n[会社名 / サポートチーム]`,
  };
  
    try {
      await transporter.sendMail(mailOptions);
      
      // ✅ 2. ユーザーに自動返信メールを送信
      await transporter.sendMail(userMailOptions);

      console.log("✅ ユーザー宛の自動返信メール送信成功:", email);
      console.log("✅ メール送信成功:", email);
      res.status(200).json({ message: "メールを送信しました" });

    } catch (error) {
      console.error("❌ メール送信エラー:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
// ✅ ローカル開発用にサーバーを起動
if (process.env.NODE_ENV !== "vercel") {
  app.listen(PORT, () => {
    console.log(`✅ サーバーがローカルで起動しました: http://localhost:${PORT}`);
  });
}
