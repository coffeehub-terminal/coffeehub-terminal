"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function ContractsPageInner(){
  const searchParams = useSearchParams();
  const roomFilter = searchParams.get('room');
  const [list,setList]=useState<any[]>([]); const [sel,setSel]=useState<any>(null)
  const [form,setForm]=useState({status:"Draft",incoterm:"FOB",shipment_window:"30 DAYS",payment_terms:"100%",special_conditions:"",price:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("Contracts").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[]); if(data?.[0]){setSel(data[0]); setForm({status:data[0].status||"Draft",incoterm:data[0].incoterm||"FOB",shipment_window:data[0].shipment_window||"30 DAYS",payment_terms:data[0].payment_terms||"100%",special_conditions:data[0].special_conditions||"",price:data[0].price||""})}})()},[])
  const save=async()=>{
    if(!sel) return
    await supabase.from("Contracts").update(form).eq("id",sel.id)
    const {data}=await supabase.from("Contracts").select("*").order("created_at",{ascending:false}).limit(100); setList(data||[])
    alert(`Contract ${sel.contract_number} saved to ${form.status}`)
  }
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sticky top-0 z-10">
        <Link href="/" className="px-3 py-1.5 rounded-full border text-xs whitespace-nowrap">← Seller OS</Link>
        <span className="font-semibold text-sm">Contracts • {list.length}</span>
        <Link href="/logistics" className="px-3 py-1.5 rounded-full border text-xs whitespace-nowrap">Logistics →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="bg-white lg:border-r lg:h-[calc(100vh-56px)] lg:overflow-auto border-b lg:border-b-0">
          {list.map((c:any)=>(
            <div key={String(c.id)} onClick={()=>{setSel(c); setForm({status:c.status||"Draft",incoterm:c.incoterm||"FOB",shipment_window:c.shipment_window||"30 DAYS",payment_terms:c.payment_terms||"100%",special_conditions:c.special_conditions||"",price:c.price||""})}} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===c.id? "bg-black text-white" : "hover:bg-neutral-50"}`}>
              <div className="text- font-medium truncate">{c.buyer_email} • {c.contract_number}</div>
              <div className="text- mt-1 opacity-70 truncate">PO {String(c.purchase_order_id).slice(0,8)} • FOB • ${c.price} • {c.status}</div>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? (
            <div className="border rounded-2xl p-4 bg-white space-y-3 max-w-lg">
              <div><h3 className="font-semibold text-sm break-all">{sel.contract_number} • {sel.buyer_email}</h3><p className="text-xs text-neutral-400 truncate">{sel.room_id} • PO {String(sel.purchase_order_id).slice(0,8)}</p></div>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm bg-white"><option>Draft</option><option>Sent</option><option>Signed</option></select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input placeholder="Incoterm - FOB" value={form.incoterm} onChange={e=>setForm({...form,incoterm:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="Shipment - 30 DAYS" value={form.shipment_window} onChange={e=>setForm({...form,shipment_window:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
              <input placeholder="Payment - 100%" value={form.payment_terms} onChange={e=>setForm({...form,payment_terms:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm"/>
              <textarea placeholder="Special conditions" value={form.special_conditions} onChange={e=>setForm({...form,special_conditions:e.target.value})} className="w-full border rounded-2xl px-4 py-3 text-sm h-24"/>
              <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm">Save - buyer sees View Contract update</button>
              <button onClick={async()=>{ const {data}=await supabase.from("Logistics").insert({contract_id:sel.id, room_id:sel.room_id, buyer_email:sel.buyer_email, status:"Booked", booking_number:`BK-${Date.now()}`}).select().single(); alert(`Logistics ${data.booking_number} created`) }} className="w-full py-3 rounded-full border text-sm bg-white">Create Logistics →</button>
            </div>
          ) : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select contract</div>}
        </div>
      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
function ContractsPageContent(){ return <Suspense fallback={<div>Loading...</div>}><ContractsPageInner /></Suspense> }
export default function ContractsPage() { return <Suspense fallback={<div>Loading...</div>}><ContractsPageContent /></Suspense> }
