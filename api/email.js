import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tujuan, subjek, pesan } = req.query;

    if (!tujuan || !subjek || !pesan) {
      return res.status(400).json({ error: "Harus ada tujuan, subjek, dan pesan" });
    }

    // Ethereal account (preview only, not real inbox)
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: `"Bot Serah" <${testAccount.user}>`,
      to: tujuan,
      subject: subjek,
      text: pesan,
      html: `<p>${pesan}</p>`,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gagal kirim email", detail: err.message });
  }
      }
