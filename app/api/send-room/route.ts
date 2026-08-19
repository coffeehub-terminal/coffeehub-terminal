import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest){
  try{
    const {to, buyerLink, roomName} = await req.json()
    if(!to) return NextResponse.json({ok:true})
    const from = process.env.RESEND_FROM || "CoffeeHub <trade@coffeehubcolombia.com>"
    const {data, error} = await resend.emails.send({
      from, to,
      subject: `Your coffee room: ${roomName}`,
      html: `<p>Your buyer room <b>${roomName}</b> is ready</p><p><a href="${buyerLink}">${buyerLink}</a></p>`
    })
    if(error) return NextResponse.json({error:error.message},{status:500})
    return NextResponse.json({ok:true, id:data?.id})
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}) }
}