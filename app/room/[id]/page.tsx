"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SellerRoomPage(){
  const {id} = useParams() as any
  const [room,setRoom]=useState<any>(null)
  const [contracts,setContracts]=useState<any[]>([])
  const [logistics,setLogistics]=useState<any[]>([])
  const [samples,setSamples]=useState<any[]>([])
  const [pos,setPos]=useState<any[]>([])
  const [editing,setEditing]=useState<any>(null)

  useEffect(()=>{
    const load=async()=>{
      const {data:r}=await supabase.from("Rooms").select("*").eq("id",id).single()
      setRoom(r)
      const rid=r?.id||id
      const rname=r?.name||id
      const {data:po1}=await supabase.from("PurchaseOrders").select("*").eq("room_id",rid)
      const {data:po2}=await supabase.from("PurchaseOrders").select("*").eq("room_id",rname)
      const allPO=[...(po1||[]),...(po2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i)
      setPos(allPO)
      const poIds=allPO.map((p:any)=>p.id)
      let cts:any[]=[]
      if(poIds.length){ const {data}=await supabase.from("Contracts").select("*").in("purchase_order_id",poIds); cts=data||[] }
      if(cts.length===0){ const {data:a}=await supabase.from("Contracts").select("*").eq("room_id",rid); const {data:b}=await supabase.from("Contracts").select("*").eq("room_id",rname); cts=[...(a||[]),...(b||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i) }
      setContracts(cts)
      const cIds=cts.map((c:any)=>c.id)
      let lgs:any[]=[]
      if(cIds.length){ const {data}=await supabase.from("Logistics").select("*").in("contract_id",cIds); lgs=data||[] }
      if(lgs.length===0){ const {data:a}=await supabase.from("Logistics").select("*").eq("room_id",rid); const {data:b}=await supabase.from("Logistics").select("*").eq("room_id",rname); lgs=[...(a||[]),...(b||[]),...lgs].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i) }
      setLogistics(lgs)
      const {data:s1}=await supabase.from("Samples").select("*").eq("room_id",rid)
      const {data:s2}=await supabase.from("Samples").select("*").eq("room_id",rname)
      setSamples([...(s1||[]),...(s2||[])].filter((v,i,a)=>a.findIndex((x:any)=>x.id===v.id)===i))
    }
    load()
  },[id])

  const save=async(table:string)=>{
    if(!editing) return
    const payload={...editing}
    const idVal = payload.id
    delete payload._table
    delete payload.id
    delete payload.created_at
    const {error}=await supabase.from(table).update(payload).eq("id",idVal)
    if(error) alert(error.message); else { alert(`${table} saved`); setEditing(null); location.reload() }
  }

  const Table = ({title,rows,table}:{title:string,rows:any[],table:string})=>(
    <div className="border rounded-lg mb-5 bg-white overflow-hidden">
      <div className="p-4 border-b font-semibold text-sm flex justify-between items-center"><span>{title} • {rows.length}</span><div className="flex gap-2"><Link href={`/${table.toLowerCase()}`} className="text-xs border rounded-full px-3 py-1 bg-white">Open {table} table →</Link>{room?.share_token && <Link href={`/r/${room.share_token}`} target="_blank" className="text-xs border rounded-full px-3 py-1 bg-black text-white">View Buyer Portal →</Link>}</div></div>
      {rows.map((r:any)=><div key={r.id} className="p-4 flex justify-between text-sm border-b last:border-0"><span>{r.contract_number||r.booking_number||r.id.slice(0,8)} • {r.status} • {r.shipping_line||r.courier||""}</span><button onClick={()=>setEditing({...r,_table:table})} className="text-xs border rounded-full px-3 py-1">Edit →</button></div>)}
      {rows.length===0 && <div className="p-4 text-xs text-gray-400">No {title} for this room yet</div>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fbfaf8] p-6">
      <div className="max-w- mx-auto">
        <div className="flex justify-between mb-6"><Link href="/" className="text-xs border rounded-full px-3 py-1 bg-white">← Green OS</Link><span className="text-xs border rounded-full px-3 py-1 bg-white">{room?.name||id} • {room?.id||""}</span></div>
        <h1 className="font-bold text-lg mb-2">Seller Room • {room?.name||id} — Editable</h1>
        <p className="text-xs text-gray-400 mb-5">Edit here, buyer sees read-only cards at /r/{room?.share_token?.slice(0,8)}... — green bar auto-updates</p>
        <Table title="Purchase Orders" rows={pos} table="PurchaseOrders"/>
        <Table title="Contracts" rows={contracts} table="Contracts"/>
        <Table title="Logistics" rows={logistics} table="Logistics"/>
        <Table title="Samples" rows={samples} table="Samples"/>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w- p-5 border max-h- overflow-auto">
            <h2 className="font-semibold mb-3">Edit {editing._table} • {String(editing.id).slice(0,8)}</h2>
            <div className="space-y-3">
              {Object.keys(editing).filter(k=>!["_table","created_at","room_id","contract_id","purchase_order_id"].includes(k)).map(k=>(
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
