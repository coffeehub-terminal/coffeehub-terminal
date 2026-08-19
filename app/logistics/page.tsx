"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
export default function LogisticsPage(){
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Booked",booking_number:"",container_number:"",container_size:"20FT",shipping_line:"",vessel_name:"",vessel:"",voyage_number:"",voyage:"",bill_of_landing:"",bill_of_lading:"",departure_port:"",arrival_port:"",etd:"",eta:"",freight_forwarder:"",notes:"",room_id:"",room_name:"",bill_of_lading_url:"",commercial_invoice_url:"",packing_list_url:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]) })()},[])
  const save=async()=>{
    if(!sel) return
    const payload = {
      status: form.status,
      booking_number: form.booking_number,
      container_number: form.container_number || null,
      container_size: form.container_size || null,
      shipping_line: form.shipping_line || null,
      vessel_name: form.vessel_name || null,
      vessel: form.vessel_name || form.vessel || null,
      voyage_number: form.voyage_number || null,
      voyage: form.voyage_number || form.voyage || null,
      bill_of_landing: form.bill_of_landing || form.bill_of_lading || null,
      bill_of_lading: form.bill_of_lading || form.bill_of_landing || null,
      departure_port: form.departure_port || null,
      arrival_port: form.arrival_port || null,
      etd: form.etd || null,
      eta: form.eta || null,
      freight_forwarder: form.freight_forwarder || null,
      notes: form.notes || null,
      bill_of_lading_url: form.bill_of_lading_url || null,
      commercial_invoice_url: form.commercial_invoice_url || null,
      packing_list_url: form.packing_list_url || null,
    }
    console.log("Saving", sel.id, payload)
    const { data, error } = await supabase.from("Logistics").update(payload).eq("id", sel.id).select().single()
    if(error){ alert("SAVE FAILED: "+error.message); console.error(error); return }
    setSel(data); setList(prev => prev.map(l => String(l.id)===String(sel.id)? data : l))
    alert(`SAVED ✓ BK-${data.booking_number} - refresh will keep it`)
  }
  return (
    <div className="min-h-screen bg-white"><div className="border-b px-6 h- flex items-center justify-between"><Link href="/" className="px-4 py-1.5 rounded-full border text-sm">← Seller OS</Link><span className="font-semibold">Logistics • {list.length}</span><Link href="/contracts" className="px-4 py-1.5 rounded-full border text-sm">Contracts →</Link></div>
      <div className="grid grid-cols-2 h-[calc(100vh-56px)]">
        <div className="border-r overflow-auto">{list.map((l:any)=><div key={String(l.id)} onClick={()=>{setSel(l); setForm({status:l.status||"Booked",booking_number:l.booking_number||"",container_number:l.container_number||"",container_size:l.container_size||"20FT",shipping_line:l.shipping_line||"",vessel_name:l.vessel_name||l.vessel||"",vessel:l.vessel||l.vessel_name||"",voyage_number:l.voyage_number||l.voyage||"",voyage:l.voyage||l.voyage_number||"",bill_of_landing:l.bill_of_landing||l.bill_of_lading||"",bill_of_lading:l.bill_of_lading||l.bill_of_landing||"",departure_port:l.departure_port||"",arrival_port:l.arrival_port||"",etd:l.etd||"",eta:l.eta||"",freight_forwarder:l.freight_forwarder||"",notes:l.notes||"",room_id:l.room_id||"",room_name:l.room_name||"",bill_of_lading_url:l.bill_of_lading_url||"",commercial_invoice_url:l.commercial_invoice_url||"",packing_list_url:l.packing_list_url||""})}} className={`px-6 py-4 border-b cursor-pointer ${String(sel?.id)===String(l.id)? "bg-black text-white" : "hover:bg-[#fbfaf8]"}`}><div className="text-sm">{l.booking_number} • {l.buyer_email}</div><div className="text-xs mt-1 opacity-70">{l.status} • {l.vessel_name||l.vessel||"-"} • {l.room_id}</div></div>)}</div>
        <div className="p-6 overflow-auto">{sel? (
            <div className="border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold">{sel.booking_number} • {sel.buyer_email}</h3><p className="text-xs text-neutral-400">Room {sel.room_id} • ID {String(sel.id)} • Contract {String(sel.contract_id)}</p>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"><option>Booked</option><option>In Transit</option><option>Delivered</option></select>
              <input value={form.booking_number} onChange={e=>setForm({...form,booking_number:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm" placeholder="Booking number"/>
              <div className="grid grid-cols-2 gap-3"><input value={form.container_number} onChange={e=>setForm({...form,container_number:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Container #"/><select value={form.container_size} onChange={e=>setForm({...form,container_size:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"><option>20FT</option><option>40FT</option><option>40FT HC</option></select></div>
              <div className="grid grid-cols-2 gap-3"><input value={form.shipping_line} onChange={e=>setForm({...form,shipping_line:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Shipping line"/><input value={form.vessel_name} onChange={e=>setForm({...form,vessel_name:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Vessel name"/></div>
              <div className="grid grid-cols-2 gap-3"><input value={form.voyage_number} onChange={e=>setForm({...form,voyage_number:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Voyage #"/><input value={form.bill_of_lading} onChange={e=>setForm({...form,bill_of_lading:e.target.value, bill_of_landing:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="BL - Bill of Lading"/></div>
              <div className="grid grid-cols-2 gap-3"><input value={form.departure_port} onChange={e=>setForm({...form,departure_port:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Departure BUN"/><input value={form.arrival_port} onChange={e=>setForm({...form,arrival_port:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Arrival HAM"/></div>
              <div className="grid grid-cols-2 gap-3"><input type="date" value={form.etd||""} onChange={e=>setForm({...form,etd:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input type="date" value={form.eta||""} onChange={e=>setForm({...form,eta:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <input value={form.freight_forwarder} onChange={e=>setForm({...form,freight_forwarder:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm" placeholder="Freight forwarder"/>
              <input value={form.bill_of_lading_url} onChange={e=>setForm({...form,bill_of_lading_url:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm" placeholder="BL URL (Drive/S3 link)"/>
              <div className="grid grid-cols-2 gap-3"><input value={form.commercial_invoice_url} onChange={e=>setForm({...form,commercial_invoice_url:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Invoice URL"/><input value={form.packing_list_url} onChange={e=>setForm({...form,packing_list_url:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm" placeholder="Packing List URL"/></div>
              <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text-sm h-20" placeholder="Notes"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm">Save logistics update - buyer sees at /logistics/{String(sel.id)}</button>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center">← Select logistics</div>}
        </div>
      </div>
    </div>
  )
}
