import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readPortfolioData, writePortfolioData } from "@/lib/portfolioStore";

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
    const safe = {
      ...parsed,
      contact: {
        ...(parsed?.contact || {}),
        messages: [],
      },
    };
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

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
      await transporter.sendMail({
        from: `"Portfolio" <${process.env.GMAIL_USER}>`,
        to: process.env.MY_EMAIL,
        subject: `Pesan baru dari ${name}`,
        html: `
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Pesan:</strong></p>
          <p>${message}</p>
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
