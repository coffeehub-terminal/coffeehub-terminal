"use client"

const getFlag = (origin:string) => {
  const o=(origin||"").toLowerCase()
  if(o.includes("colombia")) return "🇨🇴"
  if(o.includes("venezuela")) return "🇻🇪"
  if(o.includes("brazil")) return "🇧🇷"
  if(o.includes("peru")) return "🇵🇪"
  if(o.includes("ecuador")) return "🇪🇨"
  if(o.includes("bolivia")) return "🇧🇴"
  if(o.includes("panama")) return "🇵🇦"
  if(o.includes("costa")) return "🇨🇷"
  if(o.includes("guatemala")) return "🇬🇹"
  if(o.includes("honduras")) return "🇭🇳"
  if(o.includes("salvador")) return "🇸🇻"
  if(o.includes("nicaragua")) return "🇳🇮"
  if(o.includes("mexico")) return "🇲🇽"
  if(o.includes("ethiopia")) return "🇪🇹"
  if(o.includes("kenya")) return "🇰🇪"
  if(o.includes("rwanda")) return "🇷🇼"
  if(o.includes("uganda")) return "🇺🇬"
  if(o.includes("yemen")) return "🇾🇪"
  if(o.includes("india")) return "🇮🇳"
  if(o.includes("indonesia")) return "🇮🇩"
  if(o.includes("vietnam")) return "🇻🇳"
  if(o.includes("jamaica")) return "🇯🇲"
  return "🌎"
}

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Home(){
  const [activeScreen,setActiveScreen]=useState<"inventory"|"offers"|"rooms">("inventory")
  const [lots,setLots]=useState<any[]>([]); const [offers,setOffers]=useState<any[]>([]); const [rooms,setRooms]=useState<any[]>([])
  const [samples,setSamples]=useState<any[]>([]); const [pos,setPos]=useState<any[]>([]); const [contracts,setContracts]=useState<any[]>([]); const [logistics,setLogistics]=useState<any[]>([])
  const [showLotModal,setShowLotModal]=useState(false); const [showRoomModal,setShowRoomModal]=useState(false)
  const [showMore,setShowMore]=useState(false)
  const [saving,setSaving]=useState(false); const [sending,setSending]=useState(false)
  const [form,setForm]=useState({Company:"",lot_reference:"",lot_number:"",origin:"",process:"",score:"",price_per_kg:"",harvest_year:"",required_bags:"",certifications:"",photo_url:"",variety:"",farm:"",producer:"",altitude:"",cup_notes:""})
  const [roomForm,setRoomForm]=useState({name:"",email:"",selectedOffers:[] as string[]})
  const [offerSearch,setOfferSearch]=useState("")

  const fetchAll=async()=>{
    const {data:lotsData}=await supabase.from("Lots").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:offersData}=await supabase.from("Offers").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:roomsData}=await supabase.from("Rooms").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:sampData}=await supabase.from("Samples").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:poData}=await supabase.from("PurchaseOrders").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:contData}=await supabase.from("Contracts").select("*").order("created_at",{ascending:false}).limit(100)
    const {data:logData}=await supabase.from("Logistics").select("*").order("created_at",{ascending:false}).limit(100)
    if(lotsData) setLots(lotsData); if(offersData) setOffers(offersData); if(roomsData) setRooms(roomsData)
    setSamples(sampData||[]); setPos(poData||[]); setContracts(contData||[]); setLogistics(logData||[])
  }
  useEffect(()=>{fetchAll()},[])

  const filteredOffers=useMemo(()=>{ const q=offerSearch.toLowerCase(); if(!q) return offers.slice(0,25); return offers.filter((o:any)=>`${o.lot_number} ${o.origin} ${o.farm||""} ${o.variety||""}`.toLowerCase().includes(q)).slice(0,25) },[offers,offerSearch])
  const newSamples = samples.filter((s:any)=> new Date(s.created_at) > new Date(Date.now()-86400000) || s.status==="Preparing").length
  const newPOs = pos.filter((p:any)=> p.status==="Pending").length

  const createLot=async()=>{
    if(!form.lot_number||!form.origin||!form.price_per_kg){alert("required");return}
    setSaving(true)
    const toNull=(v:any)=>v===""?null:v; const toNum=(v:any)=>v===""?null:Number(v)
    const payload:any={Company:toNull(form.Company),lot_reference:toNull(form.lot_reference),lot_number:form.lot_number,origin:form.origin,process:toNull(form.process),score:toNum(form.score),price_per_kg:Number(form.price_per_kg),harvest_year:toNum(form.harvest_year),required_bags:toNum(form.required_bags),certifications:toNull(form.certifications),photo_url:toNull(form.photo_url),variety:toNull(form.variety),farm:toNull(form.farm),producer:toNull(form.producer),altitude:toNum(form.altitude),cup_notes:toNull(form.cup_notes)}
    const {data,error}=await supabase.from("Lots").insert(payload).select()
    if(error){alert(error.message); setSaving(false); return}
    await supabase.from("Offers").insert({id:`OFF-${Date.now()}`,lot_number:payload.lot_number,origin:payload.origin,price_per_kg:payload.price_per_kg,farm:payload.farm,variety:payload.variety,process:payload.process,score:payload.score,company_name:payload.Company,required_bags:payload.required_bags,status:"Open"})
    setShowLotModal(false); setForm({Company:"",lot_reference:"",lot_number:"",origin:"",process:"",score:"",price_per_kg:"",harvest_year:"",required_bags:"",certifications:"",photo_url:"",variety:"",farm:"",producer:"",altitude:"",cup_notes:""}); await fetchAll(); setSaving(false)
  }
  const createRoom=async()=>{
    if(!roomForm.name) return
    setSending(true)
    const share_token=crypto.randomUUID(); const roomId=`ROOM-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    await supabase.from("Rooms").insert({id:roomId,name:roomForm.name,offer_ids:roomForm.selectedOffers.join(","),status:"Active",share_token})
    if(roomForm.email) await supabase.from("RoomParticipants").insert({room_id:roomId,email:roomForm.email})
    const buyerLink=`${window.location.origin}/r/${share_token}`
    fetch("/api/send-room",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:roomForm.email,buyerLink,roomName:roomForm.name})}).catch(()=>{})
    setShowRoomModal(false); setRoomForm({name:"",email:"",selectedOffers:[]}); setOfferSearch(""); await fetchAll(); prompt("Room link:",buyerLink); setSending(false)
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      {/* HEADER - PRO: Samples + POs visible, Contracts/Logistics in dropdown */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <img src="/coffeehub-logo.png" alt="CoffeeHub" className="h-6 w-auto" />
            <span className="hidden sm:inline-flex text- px-2 py-1 rounded-full border bg-[#fbfaf8]">Seller</span>
          </div>
          <nav className="flex items-center gap-1.5">
            {/* Always visible on mobile: Samples + POs */}
            <Link href="/samples" className="inline-flex items-center px-3 py-1.5 rounded-full border border-black bg-white text-xs whitespace-nowrap">Samples {newSamples>0 && <span className="ml-1.5 bg-[#00C950] text-white px-2 py-0.5 rounded-full text-">+{newSamples} new</span>}</Link>
            <Link href="/purchase-orders" className="inline-flex items-center px-3 py-1.5 rounded-full border bg-white text-xs whitespace-nowrap">POs {newPOs>0 && <span className="ml-1.5 bg-[#00C950] text-white px-2 py-0.5 rounded-full text-">+{newPOs}</span>}</Link>

            {/* Desktop: show Contracts + Logistics too */}
            <Link href="/contracts" className="hidden lg:inline-flex px-3 py-1.5 rounded-full border bg-white text-xs whitespace-nowrap">Contracts <span className="ml-1 bg-black text-white px-1.5 rounded-full text-">14</span></Link>
            <Link href="/logistics" className="hidden lg:inline-flex px-3 py-1.5 rounded-full border bg-white text-xs whitespace-nowrap">Logistics</Link>

            {/* Mobile Dropdown: Contracts / Logistics */}
            <div className="relative lg:hidden">
              <button onClick={()=>setShowMore(!showMore)} className="px-3 py-1.5 rounded-full border bg-[#fbfaf8] text-xs whitespace-nowrap">More ▾</button>
              {showMore && (
                <div className="absolute right-0 top-10 w-56 bg-white border rounded-xl shadow-2xl p-2 z-50">
                  <Link onClick={()=>setShowMore(false)} href="/contracts" className="flex justify-between items-center px-3 py-3 rounded-lg hover:bg-neutral-50 text-sm"><span>Contracts</span><span className="bg-black text-white px-2 py-0.5 rounded-full text-">14</span></Link>
                  <Link onClick={()=>setShowMore(false)} href="/logistics" className="flex justify-between items-center px-3 py-3 rounded-lg hover:bg-neutral-50 text-sm"><span>Logistics</span><span className="text-neutral-400 text-xs">→</span></Link>
                  <div className="border-t my-1"></div>
                  <Link onClick={()=>setShowMore(false)} href="/purchase-orders" className="lg:hidden flex justify-between items-center px-3 py-3 rounded-lg hover:bg-neutral-50 text-sm"><span>Purchase Orders</span>{newPOs>0 && <span className="bg-[#00C950] text-white px-2 py-0.5 rounded-full text-">+{newPOs}</span>}</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-start gap-3 mb-6">
          <div><h1 className="text-xl font-bold">Your green coffee</h1><p className="text-xs text-neutral-500 mt-1">List it, share a room, move it.</p></div>
          <div className="flex gap-2"><button onClick={()=>setShowLotModal(true)} className="px-4 py-2 rounded-full bg-black text-white text-xs">+ New lot</button><button onClick={()=>setShowRoomModal(true)} className="px-4 py-2 rounded-full bg-white border text-xs">+ Buyer room</button></div>
        </div>

        <div className="flex gap-6 border-b mb-6">
          <button onClick={()=>setActiveScreen("inventory")} className={`pb-3 text-sm flex gap-2 ${activeScreen==="inventory"? "border-b-2 border-black font-medium" : "text-neutral-500"}`}>Inventory <span className={`px-2 py-0.5 rounded text-xs ${activeScreen==="inventory"? "bg-black text-white" : "bg-neutral-100"}`}>{lots.length}</span></button>
          <button onClick={()=>setActiveScreen("offers")} className={`pb-3 text-sm flex gap-2 ${activeScreen==="offers"? "border-b-2 border-black font-medium" : "text-neutral-500"}`}>Offers <span className={`px-2 py-0.5 rounded text-xs ${activeScreen==="offers"? "bg-black text-white" : "bg-neutral-100"}`}>{offers.length}</span></button>
          <button onClick={()=>setActiveScreen("rooms")} className={`pb-3 text-sm flex gap-2 ${activeScreen==="rooms"? "border-b-2 border-black font-medium" : "text-neutral-500"}`}>Rooms <span className={`px-2 py-0.5 rounded text-xs ${activeScreen==="rooms"? "bg-black text-white" : "bg-neutral-100"}`}>{rooms.length}</span></button>
        </div>

        {activeScreen==="inventory" && (<div className="bg-white rounded-xl border overflow-hidden"><div className="px-4 py-3 border-b flex justify-between text-xs"><span className="text-neutral-500">Lots in warehouse</span><span className="text-neutral-400">{lots.length} lots</span></div>{lots.map((lot:any)=>(<Link href={`/lot/${lot.id}`} key={String(lot.id)} className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-[#fbfaf8]"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-[#fbfaf8] border rounded-xl flex items-center justify-center text-">{getFlag(lot.origin||"")}</div><div><div className="text- font-medium">{lot.lot_number} • {lot.origin} {lot.score && <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-">{lot.score}</span>}</div><div className="text- text-neutral-400">{lot.Company||""} • {lot.farm||"-"} • {lot.variety||"-"} • {lot.required_bags||"?"} bags</div></div></div><div className="text-">${lot.price_per_kg}/kg</div></Link>))}</div>)}
        {activeScreen==="offers" && (<div className="bg-white rounded-xl border overflow-hidden"><div className="px-4 py-3 border-b text-xs text-neutral-500">Offers • {offers.length}</div>{offers.map((o:any)=>(<div key={String(o.id)} className="flex items-center justify-between px-4 py-3 border-b last:border-0"><div><div className="text- font-medium">{o.lot_number} • {o.company_name||"CoffeeHub"} • ${o.price_per_kg}/kg</div><div className="text- text-neutral-400">{o.farm||""} • {o.origin}</div></div><span className="text- px-2 py-1 bg-neutral-100 rounded-full">{o.status||"Open"}</span></div>))}</div>)}
        {activeScreen==="rooms" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{rooms.map((r:any)=>(<div key={String(r.id)} className="bg-white rounded-xl border p-4"><div className="flex justify-between mb-2"><span className="text- font-medium">{r.name} • {r.id}</span><span className="text- px-2 py-0.5 border rounded-full">{r.status}</span></div><div className="text- text-neutral-400 mb-3">{(r.offer_ids||"").split(",").filter(Boolean).length} lots</div><div className="flex gap-2"><button onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/r/${r.share_token}`)} className="px-3 py-1.5 rounded-full bg-black text-white text-">Copy link</button><Link href={`/room/${r.id}`} className="px-3 py-1.5 rounded-full border bg-white text-">Edit</Link><Link href={`/r/${r.share_token}`} className="px-3 py-1.5 rounded-full border bg-[#fbfaf8] text-">Buyer</Link></div></div>))}</div>)}
      </main>

      {showLotModal && (<div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-2xl w-full max-w-lg max-h- overflow-auto p-6"><h2 className="font-semibold mb-4">New lot</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input placeholder="Company" value={form.Company} onChange={e=>setForm({...form,Company:e.target.value})} className="border rounded-full px-3 py-2 text-sm"/><input placeholder="lot_number *" value={form.lot_number} onChange={e=>setForm({...form,lot_number:e.target.value})} className="border rounded-full px-3 py-2 text-sm"/><input placeholder="origin *" value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} className="border rounded-full px-3 py-2 text-sm"/><input placeholder="price_per_kg *" type="number" value={form.price_per_kg} onChange={e=>setForm({...form,price_per_kg:e.target.value})} className="border rounded-full px-3 py-2 text-sm"/></div><div className="flex justify-end gap-2 mt-4"><button onClick={()=>setShowLotModal(false)} className="px-4 py-2 rounded-full border text-sm">Cancel</button><button disabled={saving} onClick={createLot} className="px-4 py-2 rounded-full bg-black text-white text-sm">{saving? "Saving..." : "Create"}</button></div></div></div>)}
      {showRoomModal && (<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-[100]"><div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border overflow-hidden flex flex-col" style={{maxHeight:'90vh'}}><div className="p-6 border-b"><h2 className="font-semibold">New buyer room</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"><input autoFocus placeholder="Room name *" value={roomForm.name} onChange={e=>setRoomForm({...roomForm,name:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/><input placeholder="Buyer email" value={roomForm.email} onChange={e=>setRoomForm({...roomForm,email:e.target.value})} className="border rounded-full px-4 py-2.5 text-sm"/></div></div><div className="px-6 py-3 bg-[#fbfaf8] border-b"><input placeholder="Search offers" value={offerSearch} onChange={e=>setOfferSearch(e.target.value)} className="w-full bg-white border rounded-full px-4 py-2 text-sm"/></div><div className="flex-1 overflow-y-auto divide-y" style={{maxHeight:'280px'}}>{filteredOffers.map((o:any)=>{const checked=roomForm.selectedOffers.includes(o.id);return(<label key={String(o.id)} className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer ${checked? "bg-green-50/60" : ""}`}><input type="checkbox" checked={checked} onChange={e=>{if(e.target.checked) setRoomForm({...roomForm,selectedOffers:[...roomForm.selectedOffers,o.id]}); else setRoomForm({...roomForm,selectedOffers:roomForm.selectedOffers.filter(id=>id!==o.id)})}}/><div><div className="font-medium text-">{o.lot_number} • {o.origin}</div><div className="text- text-neutral-400">{o.farm||""}</div></div></label>)})}</div><div className="p-4 border-t flex justify-end gap-2 bg-white"><button onClick={()=>setShowRoomModal(false)} className="px-4 py-2 rounded-full border text-sm">Cancel</button><button disabled={sending} onClick={createRoom} className="px-5 py-2 rounded-full bg-black text-white text-sm">Create</button></div></div></div>)}
    </div>
  )
}