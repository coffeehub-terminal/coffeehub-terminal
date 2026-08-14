"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import SampleRequestButton from "@/components/SampleRequestButton"
import PurchaseOrderButton from "@/components/PurchaseOrderButton"

export default function BuyerPortal(){
  const {token}=useParams() as any
  const [room,setRoom]=useState<any>(null)
  const [participants,setParticipants]=useState<any[]>([])
  const [offers,setOffers]=useState<any[]>([])
  const [samples,setSamples]=useState<any[]>([])
  const [sampleRequests,setSampleRequests]=useState<any[]>([])
  const [pos,setPos]=useState<any[]>([])
  const [contracts,setContracts]=useState<any[]>([])
  const [logistics,setLogistics]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [viewing,setViewing]=useState<any>(null)

  useEffect(()=>{
    const load=async()=>{
      const {data:roomData}=await supabase.from("Rooms").select("*").eq("share_token",token).single()
      if(!roomData) return
      setRoom(roomData)
      const {data:parts}=await supabase.from("RoomParticipants").select("*").eq("room_id",roomData.id)
      setParticipants(parts||[])
      if(roomData.offer_ids){
        const ids=roomData.offer_ids.split(",").map((s:string)=>s.trim()).filter(Boolean)
        if(ids.length){const {data:off}=await supabase.from("Offers").select("*").in("id",ids); setOffers(off||[])}
      }
      const {data:samp}=await supabase.from("Samples").select("*").eq("room_id",roomData.id).order("created_at",{ascending:false})
      const {data:req}=await supabase.from("SampleRequests").select("*").eq("room_id",roomData.id).order("created_at",{ascending:false})
      setSamples(samp||[]); setSampleRequests(req||[])
      const {data:poId}=await supabase.from("PurchaseOrders").select("*").eq("room_id",roomData.id).order("created_at",{ascending:false})
      const {data:poName}=await supabase.from("PurchaseOrders").select("*").eq("room_id",roomData.name).order("created_at",{ascending:false})
      const allPO=[...(poId||[]),...(poName||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i)
      setPos(allPO)
      if(allPO.length){
        const poIds=allPO.map((p:any)=>p.id)
        const {data:ctByPo}=await supabase.from("Contracts").select("*").in("purchase_order_id",poIds).order("created_at",{ascending:false})
        let cts=ctByPo||[]
        if(cts.length===0){
          const {data:ctId}=await supabase.from("Contracts").select("*").eq("room_id",roomData.id).order("created_at",{ascending:false})
          const {data:ctName}=await supabase.from("Contracts").select("*").eq("room_id",roomData.name).order("created_at",{ascending:false})
          cts=[...(ctId||[]),...(ctName||[])].filter((v:any,i:number,a:any[])=>a.findIndex((x:any)=>x.id===v.id)===i)
        }
        setContracts(cts)
        const cIds=cts.map((c:any)=>c.id)
        let lgs:any[]=[]
        if(cIds.length){
          const {data:lgByCt}=await supabase.from("Logistics").select("*").in("contract_id",cIds).order("created_at",{ascending:false})
          lgs=lgByCt||[]
        }
        if(lgs.length===0){
          const {data:lgId}=await supabase.from("Logistics").select("*").eq("room_id",roomData.id).order("created_at",{ascending:false})
          const {data:lgName}=await supabase.from("Logistics").select("*").eq("room_id",roomData.name).order("created_at",{ascending:false})
          lgs=[...(lgs||[]),...(lgId||[]),...(lgName||[])].filter((v:any,i:number,a:any[])=>a.findIndex((x:any)=>x.id===v.id)===i)
        }
        setLogistics(lgs)
      }
      setLoading(false)
    }
    load()
  },[token])

  const buyerEmail = participants?.[0]?.email || "aviancoffee@gmail.com"
  const existingSample = samples[0] || null
  const existingRequest = sampleRequests[0] || null
  const getProgressIdx=(s:string)=>{const order=["Requested","Preparing","Shipped","Delivered"]; const i=order.indexOf(s); return i===-1?1:i}
  if(loading) return <div className="min-h-screen bg-white flex items-center justify-center text-sm">Loading...</div>

  const CompactView = () => {
    if(!viewing) return null
    const d = viewing.data
    // show only filled values, hide empty nulls that jammed your screenshot
    const entries = Object.entries(d).filter(([k,v])=>{
      if(!v) return false
      if(String(v).trim()==="" || String(v)==="—" ) return false
      if(["id","room_id","purchase_order_id","contract_id"].includes(k)) return false // hide raw ids
      return true
    }).slice(0,12) // max 12 lines so card stays small
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50" onClick={()=>setViewing(null)}>
        <div className="bg-white rounded-2xl w-full max-w- border shadow-xl overflow-hidden max-h- flex flex-col" onClick={e=>e.stopPropagation()}>
          <div className="p-4 border-b flex justify-between items-center bg-[#fbfaf8]">
            <span className="font-semibold text-sm">{viewing.type} • Read Only</span>
            <button onClick={()=>setViewing(null)} className="text-xs border rounded-full px-3 py-1 bg-white">Close</button>
          </div>
          <div className="divide-y overflow-auto">
            <div className="flex justify-between p-3.5 text-sm bg-gray-50/50"><span className="text- text-gray-400 uppercase">ID</span><span className="font-mono text-xs">{String(d.id).slice(0,8).toUpperCase()}</span></div>
            {entries.map(([k,v]:any)=><div key={k} className="flex justify-between p-3.5 text-sm"><span className="text- text-gray-400 uppercase tracking-wide">{k.replace(/_/g," ")}</span><span className="font-medium text-right max-w-[60%] truncate">{String(v)}</span></div>)}
          </div>
          <div className="p-3 bg-gray-50 text- text-gray-400 text-center border-t">Buyer view only • Seller edits in /contracts /logistics</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b h-14 flex items-center px-6 gap-3"><div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-xs rounded">CH</div><span className="font-semibold text-sm">CoffeeHub Buyer Portal</span><span className="ml-3 text-xs border rounded-full px-3 py-1">{room?.name} • Read Only</span></div>
      <div className="max-w- mx-auto p-6 space-y-5">
        <div className="border rounded-lg p-4 flex justify-between text-sm"><span>Offers: <b>{offers.length}</b></span><span>Participants: <b>{participants.length}</b></span><span className="text-gray-400 text-xs">{buyerEmail}</span></div>
        {existingSample? (<div className="border rounded-lg p-5"><div className="flex justify-between items-center mb-4"><span className="font-semibold text-sm">Sample Shipment — <span className="text-green-600">{existingSample.status}</span></span><span className="text- px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full">{existingSample.status}</span></div><div className="flex gap-2">{["Requested","Preparing","Shipped","Delivered"].map((step,i)=>{const active=i<=getProgressIdx(existingSample.status); return <div key={step} className="flex-1"><div className={`h-2 rounded-full ${active? "bg-green-500":"bg-gray-200"}`}></div><div className={`text- mt-1 ${active? "text-gray-700":"text-gray-400"}`}>{step}</div></div>})}</div><div className="mt-4 bg-[#f6fdf6] border border-green-100 rounded-xl p-4 text-sm"><div>Courier: <b>{existingSample.courier||"— To be updated"}</b></div><div className="mt-1">Tracking: {existingSample.tracking_number||"—"}</div><button onClick={()=>setViewing({type:"Sample", data:existingSample})} className="text-xs underline mt-2">View Details →</button></div></div>) : existingRequest? (<div className="border rounded-lg p-5 bg-blue-50/50"><div className="font-semibold text-sm">Sample Request Submitted</div></div>) : (<div className="border rounded-lg p-5"><div className="font-semibold text-sm">Need a sample?</div><div className="mt-3"><SampleRequestButton offers={offers} roomId={room?.id || ""} buyerEmail={buyerEmail} /></div></div>)}
        <div className="border rounded-lg"><div className="p-4 border-b font-semibold text-sm">Purchase Orders • {pos.length}</div>{pos.map((p:any)=><div key={p.id} className="p-4 text-sm border-b last:border-0 flex justify-between items-center"><span>{String(p.id).slice(0,8)} • {p.status} • {p.quantity||1} bags • ${p.price}/kg</span><button onClick={()=>setViewing({type:"Purchase Order", data:p})} className="text-xs px-3 py-1 rounded-full border">View PO →</button></div>)}</div>
        <div className="border rounded-lg"><div className="p-4 border-b font-semibold text-sm">Contracts • {contracts.length}</div>{contracts.map((c:any)=><div key={c.id} className="p-4 text-sm border-b last:border-0 flex justify-between items-center"><span>{c.contract_number||String(c.id).slice(0,8)} • {c.status}</span><button onClick={()=>setViewing({type:"Contract", data:c})} className="text-xs px-3 py-1 rounded-full border">View Contract →</button></div>)}</div>
        <div className="border rounded-lg"><div className="p-4 border-b font-semibold text-sm">Logistics • {logistics.length}</div>{logistics.map((l:any)=><div key={l.id} className="p-4 text-sm border-b last:border-0 flex justify-between items-center"><span>{l.booking_number||String(l.id).slice(0,8)} • {l.status}</span><button onClick={()=>setViewing({type:"Logistics", data:l})} className="text-xs px-3 py-1 rounded-full border">View Logistics →</button></div>)}</div>
      </div>
      <CompactView />
    </div>
  )
}
