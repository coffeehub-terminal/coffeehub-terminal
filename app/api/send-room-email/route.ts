import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, roomName, shareToken } = await req.json();

    const roomUrl = `https://app.coffeehubcolombia.com/r/${shareToken}`;

    const { error } = await resend.emails.send({
  from: "CoffeeHub <hello@coffeehubcolombia.com>",
  replyTo: "trade@coffeehubcolombia.com",
  to: email,
  subject: `You're invited to "${roomName}" on CoffeeHub`,
  html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#f5f7f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">

<tr>
<td style="background:#071412;padding:40px;text-align:center;">

<h1 style="margin:0;color:#22c55e;font-size:34px;">
CoffeeHub
</h1>

<p style="margin-top:12px;color:white;font-size:18px;">
Private Coffee Buying Platform
</p>

</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;">
Welcome to CoffeeHub
</h2>

<p style="
font-size:20px;
font-weight:bold;
margin-top:25px;
color:#22c55e;
">
${roomName}
</p>

<p style="font-size:17px;line-height:1.8;">
Our trading team has prepared a private buying room containing a curated selection of specialty coffees for your review.
</p>

<p style="font-size:17px;line-height:1.8;">
Within this room you can explore available lots, request pricing, request samples, and communicate directly with CoffeeHub.
</p>

<p style="font-size:17px;line-height:1.7;">
Inside your private buying room you can:
</p>

<ul style="line-height:2;">
<li>Browse available specialty coffees</li>
<li>View complete lot information</li>
<li>Request pricing</li>
<li>Request samples</li>
<li>Communicate directly with our trading team</li>
</ul>

<p style="text-align:center;margin:40px 0;">

<a
href="${roomUrl}"
style="
background:#22c55e;
color:white;
padding:18px 34px;
border-radius:8px;
font-weight:bold;
font-size:18px;
text-decoration:none;
display:inline-block;
">
Access Your Buying Room →
</a>

</p>

<p>
If the button doesn't work, copy this link into your browser:
</p>

<p style="background:#f3f4f6;padding:14px;border-radius:8px;word-break:break-all;">
${roomUrl}
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;" />

<p style="font-size:15px;color:#6b7280;">
Questions? Simply reply to this email and our trading team will be happy to assist you.
</p>

<p style="font-size:13px;color:#9ca3af;margin-top:30px;">
<strong>CoffeeHub Colombia</strong><br>

Private marketplace connecting specialty coffee producers
with international buyers.

<br><br>

trade@coffeehubcolombia.com
</p>

</td>
</tr>

</table>

</body>
</html>
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