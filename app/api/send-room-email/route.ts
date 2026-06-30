import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, roomName, shareToken } = await req.json();

    const roomUrl = `https://app.coffeehubcolombia.com/r/${shareToken}`;

    const { error } = await resend.emails.send({
      from: "CoffeeHub <onboarding@resend.dev>",
      to: email,
      subject: `CoffeeHub Invitation - ${roomName}`,
      html: `
        <h2>Welcome to CoffeeHub</h2>

        <p>You have been invited to view a private coffee room.</p>

        <p>
          <a href="${roomUrl}">
            Open Buyer Room
          </a>
        </p>

        <p>Or copy this link:</p>

        <p>${roomUrl}</p>
      `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}