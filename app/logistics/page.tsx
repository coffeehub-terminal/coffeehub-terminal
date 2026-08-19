"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LogisticsPage(){
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({booking_number:"",container_number:"",container_size:"",shipping_line:"",vessel_name:"",voyage_number:"",bill_of_lading:"",departure_port:"",arrival_port:"",etd:"",eta:"",freight_forwarder:"",status:"Booked",notes:"",bill_of_lading_url:"",commercial_invoice_url:"",packing_list_url:""})
  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100);
    setList(data||[]);
    if(data?.[0]){const c=data[0]; setSel(c); setForm({booking_number:c.booking_number||"",container_number:c.container_number||"",container_size:c.container_size||"",shipping_line:c.shipping_line||"",vessel_name:c.vessel_name||"",voyage_number:c.voyage_number||"",bill_of_lading:c.bill_of_lading||c.bill_of_landing||"",departure_port:c.departure_port||"",arrival_port:c.arrival_port||"",etd:c.etd?.slice(0,10)||"",eta:c.eta?.slice(0,10)||"",freight_forwarder:c.freight_forwarder||"",status:c.status||"Booked",notes:c.notes||"",bill_of_lading_url:c.bill_of_lading_url||"",commercial_invoice_url:c.commercial_invoice_url||"",packing_list_url:c.packing_list_url||""})}
  })()},[])
  const select=(l:any)=>{ setSel(l); setForm({booking_number:l.booking_number||"",container_number:l.container_number||"",container_size:l.container_size||"",shipping_line:l.shipping_line||"",vessel_name:l.vessel_name||"",voyage_number:l.voyage_number||"",bill_of_lading:l.bill_of_lading||l.bill_of_landing||"",departure_port:l.departure_port||"",arrival_port:l.arrival_port||"",etd:l.etd?.slice(0,10)||"",eta:l.eta?.slice(0,10)||"",freight_forwarder:l.freight_forwarder||"",status:l.status||"Booked",notes:l.notes||"",bill_of_lading_url:l.bill_of_lading_url||"",commercial_invoice_url:l.commercial_invoice_url||"",packing_list_url:l.packing_list_url||""}) }
  const save=async()=>{ if(!sel) return; await supabase.from("Logistics").update(form).eq("id",sel.id); const {data}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); alert("Saved") }
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-4 h- flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2"><img src="/coffeehub-logo.png" alt="" className="h-9 w-auto"/><span className="font-semibold text-sm">Logistics • {list.length}</span></Link>
        <Link href="/contracts" className="px-4 py-2 rounded-full border bg-white text-xs">Contracts →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr]">
        <div className="bg-white border-b lg:border-r lg:h-[calc(100vh-64px)] overflow-auto max-h- lg:max-h-none">
          {list.map((l:any)=>(<div key={String(l.id)} onClick={()=>select(l)} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===l.id? "bg-black text-white" : "hover:bg-neutral-50"}`}><div className="text- font-medium truncate">{l.booking_number} • {l.buyer_email}</div><div className="text- opacity-70 truncate">{l.status} • {l.vessel_name||""}</div></div>))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? (
            <div className="bg-white border rounded-2xl p-4 space-y-3 max-w-2xl">
              <h3 className="font-bold text-sm">{sel.booking_number} • Full 25 fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="border rounded-full px-3 py-2 text- bg-white"><option>Booked</option><option>In Transit</option><option>Delivered</option></select>
                <input placeholder="booking_number" value={form.booking_number} onChange={e=>setForm({...form,booking_number:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="container_number" value={form.container_number} onChange={e=>setForm({...form,container_number:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="container_size" value={form.container_size} onChange={e=>setForm({...form,container_size:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="shipping_line" value={form.shipping_line} onChange={e=>setForm({...form,shipping_line:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="vessel_name" value={form.vessel_name} onChange={e=>setForm({...form,vessel_name:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="voyage_number" value={form.voyage_number} onChange={e=>setForm({...form,voyage_number:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="bill_of_lading" value={form.bill_of_lading} onChange={e=>setForm({...form,bill_of_lading:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="departure_port" value={form.departure_port} onChange={e=>setForm({...form,departure_port:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="arrival_port" value={form.arrival_port} onChange={e=>setForm({...form,arrival_port:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="etd" type="date" value={form.etd} onChange={e=>setForm({...form,etd:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="eta" type="date" value={form.eta} onChange={e=>setForm({...form,eta:e.target.value})} className="border rounded-full px-3 py-2 text-"/>
                <input placeholder="freight_forwarder" value={form.freight_forwarder} onChange={e=>setForm({...form,freight_forwarder:e.target.value})} className="border rounded-full px-3 py-2 text- sm:col-span-2"/>
                <input placeholder="bill_of_lading_url" value={form.bill_of_lading_url} onChange={e=>setForm({...form,bill_of_lading_url:e.target.value})} className="border rounded-full px-3 py-2 text- sm:col-span-2"/>
                <input placeholder="commercial_invoice_url" value={form.commercial_invoice_url} onChange={e=>setForm({...form,commercial_invoice_url:e.target.value})} className="border rounded-full px-3 py-2 text- sm:col-span-2"/>
                <input placeholder="packing_list_url" value={form.packing_list_url} onChange={e=>setForm({...form,packing_list_url:e.target.value})} className="border rounded-full px-3 py-2 text- sm:col-span-2"/>
              </div>
              <textarea placeholder="notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full border rounded-2xl px-3 py-2 text- h-20"/>
              <button onClick={save} className="w-full py-2.5 rounded-full bg-black text-white text-">Save logistics update</button>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select logistics</div>}
        </div>
      </div>
    </div>
  )
}
