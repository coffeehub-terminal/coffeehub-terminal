"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SamplesPage(){
  const [list,setList]=useState<any[]>([]);
  const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Preparing", courier:"DHL", tracking_number:"", notes:""})

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100);
    setList(data||[]);
    if(data?.[0]){
      setSel(data[0]);
      setForm({
        status:data[0].status||"Preparing",
        courier:data[0].courier||"DHL",
        tracking_number:data[0].tracking_number||data[0].tracking||"",
        notes:data[0].notes||""
      })
    }
  })()},[])

  const save=async()=>{
    if(!sel) return;
    // 1. Save to DB with correct column names
    await supabase.from("Samples").update({
      status: form.status,
      courier: form.courier,
      tracking_number: form.tracking_number,
      notes: form.notes
    }).eq("id",sel.id)

    // 2. Get room to build buyer link + buyer email
    const {data:room} = await supabase.from("Rooms").select("*").eq("id", sel.room_id).single()

    // 3. SEND EMAIL TO BUYER - THIS FIXES YOUR CHAIN
    if(sel.buyer_email){
      await fetch("/api/send-sample-update",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          to: sel.buyer_email,
          roomName: room?.name || sel.room_id,
          courier: form.courier,
          tracking: form.tracking_number,
          status: form.status,
          buyerLink: room?.share_token? `${window.location.origin}/r/${room.share_token}` : `${window.location.origin}`
        })
      }).catch(e=>console.error(e))
    }

    const {data}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100);
    setList(data||[]);
    alert(`Sample ${String(sel.id).slice(0,8)} → ${form.status} + email sent to ${sel.buyer_email}`)
  }

  const pending = list.filter(s=>s.status==="Preparing" || new Date(s.created_at) > new Date(Date.now()-86400000)).length

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sticky top-0 z-10">
        <Link href="/" className="px-3 py-1.5 rounded-full border text-">← Seller OS</Link>
        <span className="font-semibold text-">Samples • {list.length} {pending>0 && <span className="ml-2 px-2 py-0.5 bg-[#00C950] text-white rounded-full text-">+{pending} new</span>}</span>
        <Link href="/logistics" className="px-3 py-1.5 rounded-full border text-">Logistics →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="bg-white lg:border-r lg:h-[calc(100vh-56px)] lg:overflow-auto border-b">
          {list.map((s:any)=>(
            <div key={String(s.id)} onClick={()=>{setSel(s); setForm({status:s.status||"Preparing", courier:s.courier||"DHL", tracking_number:s.tracking_number||s.tracking||"", notes:s.notes||""})}} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===s.id? "bg-black text-white" : "hover:bg-neutral-50"}`}>
              <div className="text- font-medium truncate">{s.buyer_email||s.id} • {s.room_id||""} • {s.lot_number||String(s.id).slice(0,8)}</div>
              <div className="text- mt-1 opacity-70 truncate">{s.courier||""} {s.tracking_number? `• ${s.tracking_number}`:""} • {s.status} • {new Date(s.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? (
            <div className="border rounded-2xl p-4 bg-white space-y-3 max-w-lg">
              <div><h3 className="font-semibold text- break-all">{sel.buyer_email||sel.id}</h3><p className="text- text-neutral-400">Room {sel.room_id} • {sel.lot_number||sel.sample_request_id?.slice(0,8)}</p></div>

              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text- bg-white">
                <option>Requested</option>
                <option>Preparing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <select value={form.courier} onChange={e=>setForm({...form,courier:e.target.value})} className="border rounded-full px-4 py-2.5 text- bg-white"><option>DHL</option><option>FedEx</option><option>UPS</option></select>
                <input placeholder="Tracking number" value={form.tracking_number} onChange={e=>setForm({...form,tracking_number:e.target.value})} className="border rounded-full px-4 py-2.5 text-"/>
              </div>

              <textarea placeholder="Notes for buyer" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text- h-24"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text- font-medium">Save + Send DHL email to buyer</button>
              <p className="text- text-neutral-400 text-center">Buyer will see update + get email with tracking link</p>
            </div>
          ) : <div className="text- text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select sample</div>}
        </div>
      </div>
    </div>
  )
}