"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function POPageInner(){
  const searchParams = useSearchParams();
  const roomFilter = searchParams.get('room');
  const [pos,setPos]=useState<any[]>([]); const [sel,setSel]=useState<any>(null); const [form,setForm]=useState({status:"Pending",quantity:"1",price:""})
  useEffect(()=>{(async()=>{ const {data}=await supabase.from("PurchaseOrders").select("*").order("created_at",{ascending:false}).limit(100); setPos(data||[]); if(data?.[0]){setSel(data[0]); setForm({status:data[0].status||"Pending",quantity:String(data[0].quantity||"1"),price:String(data[0].price||"")})}})()},[])
  const save=async()=>{ if(!sel) return; await supabase.from("PurchaseOrders").update(form).eq("id",sel.id); const {data}=await supabase.from("PurchaseOrders").select("*").order("created_at",{ascending:false}).limit(100); setPos(data||[]); alert(`PO ${String(sel.id).slice(0,8)} → ${form.status}`) }
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sticky top-0 z-10">
        <Link href="/" className="px-3 py-1.5 rounded-full border text-xs whitespace-nowrap">← Seller OS</Link>
        <span className="font-semibold text-sm">Purchase Orders • {pos.length} {pos.filter(p=>p.status==="Pending").length>0 && <span className="ml-2 px-2 py-0.5 bg-green-500 text-white rounded-full text-xs">+{pos.filter(p=>p.status==="Pending").length} pending</span>}</span>
        <Link href="/contracts" className="px-3 py-1.5 rounded-full border text-xs whitespace-nowrap">Contracts →</Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="bg-white lg:border-r lg:h-[calc(100vh-56px)] lg:overflow-auto border-b lg:border-b-0">
          {pos.map((p:any)=>(<div key={String(p.id)} onClick={()=>{setSel(p); setForm({status:p.status||"Pending",quantity:String(p.quantity||"1"),price:String(p.price||"")})}} className={`px-4 py-3 border-b cursor-pointer ${sel?.id===p.id? "bg-black text-white" : "hover:bg-[#fbfaf8]"}`}><div className="text- font-medium truncate">{p.buyer_email} • {p.room_id} • Qty {p.quantity}</div><div className="text- mt-1 opacity-70 truncate">{p.room_id} • ${p.price} • {new Date(p.created_at).toLocaleDateString()} • {p.status}</div></div>))}
        </div>
        <div className="p-3 sm:p-6 bg-[#fbfaf8]">
          {sel? <div className="border rounded-2xl p-4 bg-white space-y-3 max-w-lg"><h3 className="font-semibold text-sm break-all">{sel.buyer_email} • {sel.room_id}</h3><p className="text-xs text-neutral-400 break-all">Offer: {sel.offer_id} • Room: {sel.room_id}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input type="number" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div>
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border rounded-full px-4 py-2.5 text-sm bg-white"><option>Pending</option><option>Accepted</option><option>Rejected</option></select>
            <button onClick={save} className="w-full py-3 rounded-full bg-black text-white text-sm">Save status - buyer sees +1</button>
            <button onClick={async()=>{ const {data}=await supabase.from("Contracts").insert({purchase_order_id:sel.id, room_id:sel.room_id, buyer_email:sel.buyer_email, status:"Draft", contract_number:`CT-${String(sel.id).slice(0,8).toUpperCase()}`, price:sel.price}).select().single(); alert(`Contract ${data.contract_number} created`) }} className="w-full py-3 rounded-full border text-sm bg-white">Create Contract →</button>
          </div> : <div className="text-sm text-neutral-400 p-6 border rounded-2xl border-dashed text-center bg-white">Select PO</div>}
        </div>
      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
function POPageContent(){ return <Suspense fallback={<div>Loading...</div>}><POPageInner /></Suspense> }
export default function POPage() { return <Suspense fallback={<div>Loading...</div>}><POPageContent /></Suspense> }