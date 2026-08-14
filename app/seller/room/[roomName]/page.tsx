"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SellerRoomEdit(){
  const {roomName} = useParams() as any
  const [room,setRoom]=useState<any>(null)
  const [contracts,setContracts]=useState<any[]>([])
  const [logistics,setLogistics]=useState<any[]>([])
  const [samples,setSamples]=useState<any[]>([])
  const [pos,setPos]=useState<any[]>([])
  const [editing,setEditing]=useState<any>(null)

  useEffect(()=>{
    const load=async()=>{
      const {data:r}=await supabase.from("Rooms").select("*").eq("name",roomName).single()
      let current = r
      if(!r){ const {data:r2}=await supabase.from("Rooms").select("*").eq("id",roomName).single(); current=r2; setRoom(r2); }
      else setRoom(r)
      const rid = current?.id || roomName
      const rname = current?.name || roomName
      const {data:ct1}=await supabase.from("Contracts").select("*").eq("room_id",rid)
      const {data:ct2}=await supabase.from("Contracts").select("*").eq("room_id",rname)
      setContracts([...(ct1||[]),...(ct2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i))
      const {data:lg1}=await supabase.from("Logistics").select("*").eq("room_id",rid)
      const {data:lg2}=await supabase.from("Logistics").select("*").eq("room_id",rname)
      setLogistics([...(lg1||[]),...(lg2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i))
      const {data:s1}=await supabase.from("Samples").select("*").eq("room_id",rid)
      const {data:s2}=await supabase.from("Samples").select("*").eq("room_id",rname)
      setSamples([...(s1||[]),...(s2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i))
      const {data:p1}=await supabase.from("PurchaseOrders").select("*").eq("room_id",rid)
      const {data:p2}=await supabase.from("PurchaseOrders").select("*").eq("room_id",rname)
      setPos([...(p1||[]),...(p2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i))
    }
    load()
  },[roomName])

  const save = async(table:string)=>{
    if(!editing) return
    const payload = {...editing}
    const id = payload.id
    delete payload._table
    delete payload.id
    delete payload.created_at
    const {error} = await supabase.from(table).update(payload).eq("id",id)
    if(error) alert(error.message)
    else { alert(`${table} saved`); setEditing(null); location.reload() }
  }

  const Row = ({title, rows, table}:{title:string, rows:any[], table:string})=>(
    <div className="border rounded-lg mb-5 bg-white overflow-hidden">
      <div className="p-4 border-b font-semibold text-sm flex justify-between items-center"><span>{title} • {rows.length}</span><Link href={`/${table.toLowerCase()}`} className="text-xs border rounded-full px-3 py-1.5 bg-white">Open {title} table →</Link></div>
      {rows.map((r:any)=><div key={r.id} className="p-4 flex justify-between text-sm border-b last:border-0"><span>{r.contract_number||r.booking_number||r.id.slice(0,8)} • {r.status} • {r.courier||r.shipping_line||""}</span><button onClick={()=>setEditing({...r, _table:table})} className="text-xs border rounded-full px-3 py-1.5">Edit →</button></div>)}
      {rows.length===0 && <div className="p-4 text-xs text-gray-400">No {title} for this room yet</div>}
    </div>
  )

  return (
    <div className="p-6 max-w- mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-bold text-lg">Room {roomName} • Seller Edit</h1><Link href="/" className="text-xs border rounded-full px-3 py-1.5 bg-white">← Back to Green OS</Link></div>
      <div className="border rounded-lg p-4 mb-5 text-sm bg-[#fbfaf8] flex justify-between items-center"><span>Room ID: {room?.id || roomName} • Share: <span className="font-mono text-xs">{room?.share_token?.slice(0,8)}...</span></span><Link href={`/r/${room?.share_token}`} target="_blank" className="text-xs border rounded-full px-3 py-1.5 bg-black text-white">View Buyer Portal (read-only) →</Link></div>
      <Row title="Purchase Orders" rows={pos} table="PurchaseOrders"/>
      <Row title="Contracts" rows={contracts} table="Contracts"/>
      <Row title="Logistics" rows={logistics} table="Logistics"/>
      <Row title="Samples" rows={samples} table="Samples"/>
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w- p-5 border max-h- overflow-auto">
            <h2 className="font-semibold mb-3">Edit {editing._table} • {String(editing.id).slice(0,8)}</h2>
            <div className="space-y-3">
              {Object.keys(editing).filter(k=>!["_table","id","created_at","room_id","contract_id","purchase_order_id","buyer_email","offer_id"].includes(k)).map(k=>(
                <div key={k} className="flex flex-col"><label className="text- uppercase tracking-widest text-gray-400">{k.replace(/_/g," ")}</label><input value={editing[k]||""} onChange={e=>setEditing({...editing,[k]:e.target.value})} className="border rounded px-3 py-2 text-sm"/></div>
              ))}
            </div>
            <div className="flex gap-2 mt-4"><button onClick={()=>save(editing._table)} className="bg-black text-white rounded-full px-4 py-2 text-sm">Save {editing._table}</button><button onClick={()=>setEditing(null)} className="border rounded-full px-4 py-2 text-sm">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
