"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"
export default function NewLotPage(){
  const router = useRouter()
  const [saving,setSaving]=useState(false)
  const [form,setForm]=useState({Company:"",lot_reference:"",lot_number:"",origin:"",process:"",score:"",price_per_kg:"",harvest_year:"",required_bags:"",certifications:"",photo_url:"",variety:"",farm:"",producer:"",altitude:"",cup_notes:""})
  const createLot=async()=>{
    if(!form.lot_number||!form.origin||!form.price_per_kg){alert("lot_number, origin, price_per_kg required");return}
    setSaving(true)
    const toNull=(v:any)=>v===""?null:v; const toNum=(v:any)=>v===""?null:Number(v)
    const payload:any={Company:toNull(form.Company),lot_reference:toNull(form.lot_reference),lot_number:form.lot_number,origin:form.origin,process:toNull(form.process),score:toNum(form.score),price_per_kg:Number(form.price_per_kg),harvest_year:toNum(form.harvest_year),required_bags:toNum(form.required_bags),certifications:toNull(form.certifications),photo_url:toNull(form.photo_url),variety:toNull(form.variety),farm:toNull(form.farm),producer:toNull(form.producer),altitude:toNum(form.altitude),cup_notes:toNull(form.cup_notes)}
    const {error}=await supabase.from("Lots").insert(payload)
    if(error){alert(error.message); setSaving(false); return}
    await supabase.from("Offers").insert({id:`OFF-${Date.now()}`,lot_number:payload.lot_number,origin:payload.origin,price_per_kg:payload.price_per_kg,farm:payload.farm,variety:payload.variety,process:payload.process,score:payload.score,company_name:payload.Company,required_bags:payload.required_bags,status:"Open"})
    router.push("/")
  }
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="border-b bg-white px-4 h- flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2"><img src="/coffeehub-logo.png" alt="" className="h-9 w-auto"/><span className="font-semibold text-sm">New Lot</span></Link>
        <Link href="/" className="px-4 py-2 rounded-full border bg-white text-xs">← Back</Link>
      </div>
      <div className="max-w-xl mx-auto p-4">
        <div className="bg-white border rounded-2xl p-4 sm:p-6 space-y-4">
          <h1 className="font-bold text-">Add new lot - scroll, no jam</h1>
          <div className="grid grid-cols-1 gap-3">
            <input placeholder="Company *" value={form.Company} onChange={e=>setForm({...form,Company:e.target.value})} className="border rounded-full px-4 py-3 text- w-full"/>
            <input placeholder="lot_number *" value={form.lot_number} onChange={e=>setForm({...form,lot_number:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="origin *" value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="price_per_kg *" type="number" step="0.01" value={form.price_per_kg} onChange={e=>setForm({...form,price_per_kg:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="farm" value={form.farm} onChange={e=>setForm({...form,farm:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="variety" value={form.variety} onChange={e=>setForm({...form,variety:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="process" value={form.process} onChange={e=>setForm({...form,process:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
            <input placeholder="required_bags" type="number" value={form.required_bags} onChange={e=>setForm({...form,required_bags:e.target.value})} className="border rounded-full px-4 py-3 text-"/>
          </div>
          <button disabled={saving} onClick={createLot} className="w-full py-3.5 rounded-full bg-black text-white text-sm font-medium">{saving? "Saving..." : "Create lot + offer →"}</button>
        </div>
      </div>
    </div>
  )
}
