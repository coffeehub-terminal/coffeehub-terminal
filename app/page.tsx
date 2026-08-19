"use client"
const getFlag = (origin:string) => {
  const o=(origin||"").toLowerCase()
  if(o.includes("colombia")) return "🇨🇴"; if(o.includes("brazil")) return "🇧🇷"; if(o.includes("ethiopia")) return "🇪🇹"; return "🌎"
}
import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Home(){
  const [activeScreen,setActiveScreen]=useState<"inventory"|"offers"|"rooms">("inventory")
  const [lots,setLots]=useState<any[]>([]); const [offers,setOffers]=useState<any[]>([]); const [rooms,setRooms]=useState<any[]>([])
  const [samples,setSamples]=useState<any[]>([]); const [pos,setPos]=useState<any[]>([]); const [showRoomModal,setShowRoomModal]=useState(false); const [showMore,setShowMore]=useState(false)
  const [sending,setSending]=useState(false)
  const [roomForm,setRoomForm]=useState({name:"",email:"",selectedOffers:[] as string[]}); const [offerSearch,setOfferSearch]=useState("")
  const fetchAll=async()=>{
    const {data:lotsData}=await supabase.from("Lots").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:offersData}=await supabase.from("Offers").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:roomsData}=await supabase.from("Rooms").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:sampData}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:poData}=await supabase.from("PurchaseOrders").select("*").order("created_at",{ascending:false}).limit(100)
    if(lotsData) setLots(lotsData); if(offersData) setOffers(offersData); if(roomsData) setRooms(roomsData); setSamples(sampData||[]); setPos(poData||[])
  }
  useEffect(()=>{fetchAll()},[])
  const filteredOffers=useMemo(()=>{ const q=offerSearch.toLowerCase(); if(!q) return offers.slice(0,25); return offers.filter((o:any)=>`${o.lot_number} ${o.origin} ${o.farm||""}`.toLowerCase().includes(q)).slice(0,25) },[offers,offerSearch])
  const newSamples = samples.filter((s:any)=> new Date(s.created_at) > new Date(Date.now()-86400000) || s.status==="Preparing").length
  const newPOs = pos.filter((p:any)=> p.status==="Pending").length
  const createRoom=async()=>{
    if(!roomForm.name) return; setSending(true)
    const share_token=crypto.randomUUID(); const roomId=`ROOM-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    await supabase.from("Rooms").insert({id:roomId,name:roomForm.name,offer_ids:roomForm.selectedOffers.join(","),status:"Active",share_token})
    if(roomForm.email) await supabase.from("RoomParticipants").insert({room_id:roomId,email:roomForm.email})
    const buyerLink=`${window.location.origin}/r/${share_token}`
    fetch("/api/send-room",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:roomForm.email,buyerLink,roomName:roomForm.name})}).catch(()=>{})
    setShowRoomModal(false); setRoomForm({name:"",email:"",selectedOffers:[]}); setOfferSearch(""); await fetchAll(); prompt("Room link:",buyerLink); setSending(false)
  }
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="h- flex items-center justify-between">
            <img src="/coffeehub-logo.png" alt="CoffeeHub" className="h- w-auto max-w- object-contain shrink-0" />
            <nav className="hidden lg:flex items-center gap-1.5 ml-auto">
              <Link href="/samples" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">Samples {newSamples>0? `(${newSamples})` : ""}</Link>
              <Link href="/purchase-orders" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">POs {newPOs>0? `(${newPOs})` : ""}</Link>
              <Link href="/contracts" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">Contracts</Link>
              <Link href="/logistics" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">Logistics</Link>
            </nav>
          </div>
          <div className="flex lg:hidden items-center gap-1.5 pb-2.5">
            <Link href="/samples" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">Samples {newSamples>0? `(${newSamples})` : ""}</Link>
            <Link href="/purchase-orders" className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 text- font-medium text-zinc-700">POs {newPOs>0? `(${newPOs})` : ""}</Link>
            <div className="relative">
              <button onClick={()=>setShowMore(!showMore)} className="inline-flex h- items-center justify-center whitespace-nowrap rounded-full border border-zinc-200 bg-[#fbfaf8] px-3 text- font-medium text-zinc-700">More ▾</button>
              {showMore && <div className="absolute left-0 top- w-44 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1 z-50"><Link href="/contracts" className="block px-3 py-2.5 rounded-lg hover:bg-zinc-50 text-">Contracts</Link><Link href="/logistics" className="block px-3 py-2.5 rounded-lg hover:bg-zinc-50 text-">Logistics</Link></div>}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
        <div className="flex justify-between items-start gap-3 mb-6"><div><h1 className="text- font-bold leading-tight">Your green coffee</h1><p className="text- text-neutral-500 mt-1">List it, share a room, move it.</p></div><div className="flex gap-2 shrink-0"><Link href="/lots/new" className="inline-flex h- items-center justify-center px-4 rounded-full bg-black text-white text- font-medium">+ New lot</Link><button onClick={()=>setShowRoomModal(true)} className="inline-flex h- items-center justify-center px-4 rounded-full bg-white border border-zinc-200 text- font-medium">+ Buyer room</button></div></div>
        <div className="flex gap-6 border-b border-zinc-200 mb-6"><button onClick={()=>setActiveScreen("inventory")} className={`pb-3 text- ${activeScreen==="inventory"? "border-b-2 border-black font-medium text-zinc-900" : "text-neutral-500"}`}>Inventory {lots.length}</button><button onClick={()=>setActiveScreen("offers")} className={`pb-3 text- ${activeScreen==="offers"? "border-b-2 border-black font-medium text-zinc-900" : "text-neutral-500"}`}>Offers {offers.length}</button><button onClick={()=>setActiveScreen("rooms")} className={`pb-3 text- ${activeScreen==="rooms"? "border-b-2 border-black font-medium text-zinc-900" : "text-neutral-500"}`}>Rooms {rooms.length}</button></div>
        {activeScreen==="inventory" && (<div className="bg-white rounded-xl border border-zinc-200 overflow-hidden"><div className="px-4 py-3 border-b border-zinc-200 flex justify-between text-"><span className="text-neutral-500">Lots in warehouse - full</span><span className="text-neutral-400">{lots.length} lots</span></div>{lots.map((lot:any)=>(<Link href={`/lot/${lot.id}`} key={String(lot.id)} className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 last:border-0 hover:bg-[#fbfaf8] gap-2"><div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 bg-[#fbfaf8] border border-zinc-200 rounded-xl flex items-center justify-center text- shrink-0">{getFlag(lot.origin||"")}</div><div className="min-w-0"><div className="text- font-medium truncate">{lot.lot_number} • {lot.origin} • {lot.process||""} • {lot.score||""}</div><div className="text- text-neutral-400 truncate">{lot.Company||""} • {lot.farm||"-"} • {lot.variety||"-"} • {lot.required_bags||"?"} bags</div></div></div><div className="text- font-medium shrink-0">${lot.price_per_kg}/kg</div></Link>))}</div>)}
        {activeScreen==="offers" && (<div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">{offers.map((o:any)=>(<div key={String(o.id)} className="flex justify-between px-4 py-3 border-b border-zinc-200 last:border-0"><div className="min-w-0"><div className="text- font-medium truncate">{o.lot_number} • {o.company_name||"CoffeeHub"} • ${o.price_per_kg}/kg</div><div className="text- text-neutral-400 truncate">{o.farm||""} • {o.origin}</div></div><span className="text- px-2 py-1 bg-neutral-100 rounded-full h-fit shrink-0 ml-2">{o.status||"Open"}</span></div>))}</div>)}
        {activeScreen==="rooms" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{rooms.map((r:any)=>(<div key={String(r.id)} className="bg-white rounded-xl border border-zinc-200 p-4"><div className="flex justify-between mb-1 gap-2"><span className="text- font-medium truncate">{r.name}</span><span className="text- px-2 py-0.5 border border-zinc-200 rounded-full h-fit shrink-0">{r.status}</span></div><div className="text- text-neutral-400 mb-1">{(r.offer_ids||"").split(",").filter(Boolean).length} lots</div><div className="text- text-neutral-400 mb-3 truncate">{r.id}</div><div className="flex gap-2"><button onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/r/${r.share_token}`)} className="px-3 py-1.5 rounded-full bg-black text-white text-">Copy link</button><Link href={`/room/${r.id}`} className="px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-">Edit</Link><Link href={`/r/${r.share_token}`} className="px-3 py-1.5 rounded-full border border-zinc-200 bg-[#fbfaf8] text-">Buyer</Link></div></div>))}</div>)}
      </main>
      {showRoomModal && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-[100]"><div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 overflow-hidden flex flex-col" style={{maxHeight:'90vh'}}><div className="p-6 border-b border-zinc-200"><h2 className="font-semibold text-">New buyer room</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"><input autoFocus placeholder="Room name *" value={roomForm.name} onChange={e=>setRoomForm({...roomForm,name:e.target.value})} className="border border-zinc-200 rounded-full px-4 py-2.5 text-"/><input placeholder="Buyer email" value={roomForm.email} onChange={e=>setRoomForm({...roomForm,email:e.target.value})} className="border border-zinc-200 rounded-full px-4 py-2.5 text-"/></div></div><div className="px-6 py-3 bg-[#fbfaf8] border-b border-zinc-200"><input placeholder="Search offers" value={offerSearch} onChange={e=>setOfferSearch(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-full px-4 py-2 text-"/></div><div className="flex-1 overflow-y-auto divide-y divide-zinc-100" style={{maxHeight:'280px'}}>{filteredOffers.map((o:any)=>{const checked=roomForm.selectedOffers.includes(o.id);return(<label key={String(o.id)} className={`flex items-center gap-3 px-6 py-3 text- cursor-pointer ${checked? "bg-green-50/60" : ""}`}><input type="checkbox" checked={checked} onChange={e=>{if(e.target.checked) setRoomForm({...roomForm,selectedOffers:[...roomForm.selectedOffers,o.id]}); else setRoomForm({...roomForm,selectedOffers:roomForm.selectedOffers.filter(id=>id!==o.id)})}}/><div><div className="font-medium text-">{o.lot_number} • {o.origin}</div><div className="text- text-neutral-400">{o.farm||""}</div></div></label>)})}</div><div className="p-4 border-t border-zinc-200 flex justify-end gap-2 bg-white"><button onClick={()=>setShowRoomModal(false)} className="px-4 py-2 rounded-full border border-zinc-200 text-">Cancel</button><button disabled={sending} onClick={createRoom} className="px-5 py-2 rounded-full bg-black text-white text-">Create</button></div></div></div>)}
    </div>
  )
}