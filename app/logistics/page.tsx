"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LogisticsPage(){
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Booked",booking_number:"",container:"",notes:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); if(data?.[0]){setSel(data[0]); setForm({status:data[0].status||"Booked",booking_number:data[0].booking_number||"",container:data[0].container||"",notes:data[0].notes||""})}})()},[])
  const save=async()=>{ if(!sel) return; await supabase.from("Logistics").update(form).eq("id",sel.id); const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); alert(`Logistics ${form.booking_number} → ${form.status}`)}
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sticky top-0 z-10">
        <Link href="/" className="px-3 py-1.5 rounded-full border text-xs">← Seller OS</Link>
        <span className="font-semibold text-sm">Logistics • {list.length}</span>
        <Link href="/contracts" className="px-3 py-1.5 rounded-full border text-xs">Contracts →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="bg-white lg:border-r lg:h-[calc(100vh-56px)] lg:overflow-auto border-b">
          {list.map((l:any)=>(
            <div key={String(l.id)} onClick={()=>{setSel(l); setForm({status:l.status||"Booked",booking_number:l.booking_number||"",container:l.container||"",notes:l.notes||""})}} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===l.id? "bg-black text-white" : "hover:bg-neutral-50"}`}>
              <div className="text- font-medium truncate">{l.booking_number||l.id} • {l.buyer_email||""}</div>
              <div className="text- mt-1 opacity-70 truncate">Contract {String(l.contract_id).slice(0,8)} • {l.status}</div>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? (
            <div className="border rounded-2xl p-4 bg-white space-y-3 max-w-lg">
              <div><h3 className="font-semibold text-sm">{sel.booking_number}</h3><p className="text-xs text-neutral-400">Buyer {sel.buyer_email} • Contract {String(sel.contract_id).slice(0,8)}</p></div>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm bg-white"><option>Booked</option><option>Shipped</option><option>Delivered</option></select>
              <input placeholder="Booking number" value={form.booking_number} onChange={e=>setForm({...form,booking_number:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <input placeholder="Container" value={form.container} onChange={e=>setForm({...form,container:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text-sm h-24"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm">Save logistics update</button>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select logistics</div>}
        </div>
      </div>
    </div>
  )
}
