"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SamplesPage(){
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Preparing",tracking:"",notes:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); if(data?.[0]){setSel(data[0]); setForm({status:data[0].status||"Preparing",tracking:data[0].tracking||"",notes:data[0].notes||""})}})()},[])
  const save=async()=>{ if(!sel) return; await supabase.from("Samples").update(form).eq("id",sel.id); const {data}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); alert(`Sample ${String(sel.id).slice(0,8)} → ${form.status}`)}
  const pending = list.filter(s=>s.status==="Preparing" || new Date(s.created_at) > new Date(Date.now()-86400000)).length
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sticky top-0 z-10">
        <Link href="/" className="px-3 py-1.5 rounded-full border text-xs">← Seller OS</Link>
        <span className="font-semibold text-sm">Samples • {list.length} {pending>0 && <span className="ml-2 px-2 py-0.5 bg-[#00C950] text-white rounded-full text-xs">+{pending} new</span>}</span>
        <Link href="/logistics" className="px-3 py-1.5 rounded-full border text-xs">Logistics →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="bg-white lg:border-r lg:h-[calc(100vh-56px)] lg:overflow-auto border-b">
          {list.map((s:any)=>(
            <div key={String(s.id)} onClick={()=>{setSel(s); setForm({status:s.status||"Preparing",tracking:s.tracking||"",notes:s.notes||""})}} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===s.id? "bg-black text-white" : "hover:bg-neutral-50"}`}>
              <div className="text- font-medium truncate">{s.buyer_email||s.id} • {s.room_id||""} • {s.lot_number||String(s.id).slice(0,8)}</div>
              <div className="text- mt-1 opacity-70 truncate">{s.origin||""} • {s.status} • {new Date(s.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? (
            <div className="border rounded-2xl p-4 bg-white space-y-3 max-w-lg">
              <div><h3 className="font-semibold text-sm break-all">{sel.buyer_email||sel.id}</h3><p className="text-xs text-neutral-400">Room {sel.room_id} • {sel.lot_number}</p></div>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm bg-white"><option>Preparing</option><option>Sent</option><option>Delivered</option><option>Approved</option></select>
              <input placeholder="Tracking number" value={form.tracking} onChange={e=>setForm({...form,tracking:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <textarea placeholder="Notes for buyer" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text-sm h-24"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm">Save - buyer sees sample update</button>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select sample</div>}
        </div>
      </div>
    </div>
  )
}
