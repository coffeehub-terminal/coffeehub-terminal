"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
export default function LogisticsPage(){
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Booked",booking_number:"",container_number:"",container_size:"20FT",shipping_line:"",vessel_name:"",voyage_number:"",bill_of_lading:"",departure_port:"",arrival_port:"",etd:"",eta:"",freight_forwarder:"",notes:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]) })()},[])
  const save=async()=>{
    if(!sel) return
    // ONLY send columns that actually exist in DB - remove any extra
    const payload = {
      status: form.status,
      booking_number: form.booking_number,
      container_number: form.container_number || null,
      container_size: form.container_size || null,
      shipping_line: form.shipping_line || null,
      vessel_name: form.vessel_name || null,
      voyage_number: form.voyage_number || null,
      bill_of_lading: form.bill_of_lading || null,
      departure_port: form.departure_port || null,
      arrival_port: form.arrival_port || null,
      etd: form.etd || null,
      eta: form.eta || null,
      freight_forwarder: form.freight_forwarder || null,
      notes: form.notes || null,
    }
    console.log("Saving logistics", sel.id, payload)
    const { data, error } = await supabase.from("Logistics").update(payload).eq("id", sel.id).select().single()
    if(error){
      alert("SAVE FAILED: "+error.message+"\n\nCheck Supabase RLS - Logistics table needs UPDATE policy for anon/authenticated")
      console.error(error)
      return
    }
    // Update local state immediately
    setSel(data)
    setList(prev => prev.map(l => l.id===sel.id? data : l))
    alert(`SAVED ✓ ${data.booking_number} → ${data.status} - buyer at /logistics/${data.id} will see it`)
  }
  return (
    <div className="min-h-screen bg-white"><div className="border-b px-6 h- flex items-center justify-between"><Link href="/" className="px-4 py-1.5 rounded-full border text-sm">← Seller OS</Link><span className="font-semibold">Logistics • {list.length}</span><Link href="/contracts" className="px-4 py-1.5 rounded-full border text-sm">Contracts →</Link></div>
      <div className="grid grid-cols-2 h-[calc(100vh-56px)]">
        <div className="border-r overflow-auto">{list.map((l:any)=>(
          <div key={String(l.id)} onClick={()=>{setSel(l); setForm({status:l.status||"Booked",booking_number:l.booking_number||"",container_number:l.container_number||"",container_size:l.container_size||"20FT",shipping_line:l.shipping_line||"",vessel_name:l.vessel_name||"",voyage_number:l.voyage_number||"",bill_of_lading:l.bill_of_lading||l.bill_of_landing||"",departure_port:l.departure_port||"",arrival_port:l.arrival_port||"",etd:l.etd||"",eta:l.eta||"",freight_forwarder:l.freight_forwarder||"",notes:l.notes||""})}} className={`px-6 py-4 border-b cursor-pointer ${sel?.id===l.id? "bg-black text-white" : "hover:bg-[#fbfaf8]"}`}>
            <div className="text-sm">{l.booking_number} • {l.buyer_email} • {l.room_id}</div><div className="text-xs mt-1 opacity-70">{l.status} • {l.vessel_name||"-"} • {l.bill_of_lading||"-"}</div>
          </div>
        ))}</div>
        <div className="p-6 overflow-auto">
          {sel? (
            <div className="border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold">{sel.booking_number} • {sel.buyer_email}</h3><p className="text-xs text-neutral-400">{sel.room_id}</p>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"><option>Booked</option><option>In Transit</option><option>Delivered</option></select>
              <input placeholder="Booking number" value={form.booking_number} onChange={e=>setForm({...form,booking_number:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <div className="grid grid-cols-2 gap-3"><input placeholder="Container # - e.g. MSKU1234567" value={form.container_number} onChange={e=>setForm({...form,container_number:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><select value={form.container_size} onChange={e=>setForm({...form,container_size:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"><option>20FT</option><option>40FT</option><option>40FT HC</option></select></div>
              <div className="grid grid-cols-2 gap-3"><input placeholder="Shipping line - Maersk" value={form.shipping_line} onChange={e=>setForm({...form,shipping_line:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="Vessel name - MSC Luna" value={form.vessel_name} onChange={e=>setForm({...form,vessel_name:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <div className="grid grid-cols-2 gap-3"><input placeholder="Voyage # - 123E" value={form.voyage_number} onChange={e=>setForm({...form,voyage_number:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="BL - Bill of Lading" value={form.bill_of_lading} onChange={e=>setForm({...form,bill_of_lading:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <div className="grid grid-cols-2 gap-3"><input placeholder="Departure port - BUN" value={form.departure_port} onChange={e=>setForm({...form,departure_port:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="Arrival port - HAM" value={form.arrival_port} onChange={e=>setForm({...form,arrival_port:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <div className="grid grid-cols-2 gap-3"><input type="date" value={form.etd||""} onChange={e=>setForm({...form,etd:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input type="date" value={form.eta||""} onChange={e=>setForm({...form,eta:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <input placeholder="Freight forwarder" value={form.freight_forwarder} onChange={e=>setForm({...form,freight_forwarder:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text-sm h-20"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm font-medium">Save logistics update</button>
              <div className="text- text-center text-neutral-400">After save, open /logistics/{sel.id} to see buyer view - should persist after refresh</div>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center">← Select logistics</div>}
        </div>
      </div>
    </div>
  )
}
