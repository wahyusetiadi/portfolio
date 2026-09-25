import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readPortfolioData, toPublicPortfolioData, writePortfolioData } from "@/lib/portfolioStore";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function GET() {
  try {
    const parsed = await readPortfolioData();
    // Jangan expose pesan kontak (email, dll) ke publik.
    return NextResponse.json(toPublicPortfolioData(parsed));
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" || !name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json({ error: "Nama, email, dan pesan wajib diisi" }, { status: 400 });
    }

    // Simpan ke JSON
    const data = await readPortfolioData();
    data.contact.messages = [
      ...(data.contact.messages || []),
      { name, email, message, date: new Date().toISOString() },
    ];
    await writePortfolioData(data);

    // Kirim email
    let emailSent = false;
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.MY_EMAIL) throw new Error("Email env belum dikonfigurasi");
      const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[c] || c));
      await transporter.sendMail({
        from: `"Portfolio" <${process.env.GMAIL_USER}>`,
        to: process.env.MY_EMAIL,
        replyTo: email,
        subject: `Pesan baru dari ${name}`,
        html: `
          <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Pesan:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        `,
      });
      emailSent = true;
    } catch (err) {
      console.error("Failed to send email:", err);
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
