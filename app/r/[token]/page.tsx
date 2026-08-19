import { supabase } from "@/lib/supabase";
import SampleRequestButton from "@/components/SampleRequestButton";
import PurchaseOrderButton from "@/components/PurchaseOrderButton";
import Link from "next/link";
export default async function RoomPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: room } = await supabase.from("Rooms").select("*").eq("share_token", token).maybeSingle();
  if(!room) return <main className="p-10 text-sm">Room not found {token}</main>;
  const { data: participants } = await supabase.from("RoomParticipants").select("*").eq("room_id", room.id);
  const buyerEmail = participants?.[0]?.email||participants?.[0]?.buyer_email||"";
  const offerIds = (room.offer_ids||"").split(",").map((s:string)=>s.trim()).filter(Boolean);
  const { data: offers } = await supabase.from("Offers").select("*").in("id", offerIds.length?offerIds:["NONE"]);
  const { data: samples } = await supabase.from("Samples").select("*").eq("room_id", room.id).order("created_at",{ascending:false});
  const hasSample = (samples?.length||0)>0;
  const { data: purchaseOrders } = await supabase.from("PurchaseOrders").select("*").eq("room_id", room.id);
  let contracts:any[]=[]; let logistics:any[]=[];
  if(purchaseOrders?.length){
    const { data: c } = await supabase.from("Contracts").select("*").in("purchase_order_id", purchaseOrders.map((p:any)=>p.id)); if(c) contracts=c;
    if(c?.length){ const { data: l } = await supabase.from("Logistics").select("*").in("contract_id", c.map((x:any)=>x.id)); if(l) logistics=l; }
  }
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-black h- flex items-center px-6 justify-between">
        <div className="flex items-center"><div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-xs">CH</div><span className="ml-2 font-bold text-sm">CoffeeHub Buyer Portal</span><span className="ml-3 text- border border-black rounded-full px-2.5 py-1">{room.id} • {room.status}</span></div>
        {!hasSample && <SampleRequestButton offers={offers||[]} roomId={room.id} buyerEmail={buyerEmail} />}
        {hasSample && <span className="text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">Sample Requested ✓</span>}
      </div>
      <div className="max-w- mx-auto p-6 space-y-5">
        <div className="border border-black rounded-lg p-4"><div className="flex justify-between"><b className="text-sm">Sample Shipment — <span className="text-green-700">{samples?.[0]?.status||"Not requested yet"}</span></b></div><div className="mt-3 bg-[#f6fef9] border border-green-50 rounded-xl p-3 text-sm">Courier: <b>{samples?.[0]?.courier||"-"}</b> • Tracking: <b>{samples?.[0]?.tracking_number||"-"}</b></div></div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b font-bold text-sm">Available Coffees • {offers?.length||0}</div>
          {offers?.map((o:any)=>{ const existingPO = purchaseOrders?.find((p:any)=>p.offer_id===o.id); return <div key={o.id} className="px-4 py-4 border-b flex justify-between items-center"><div><div className="text-sm font-medium">{o.lot_number} • {o.origin} • ${o.price_per_kg||o.price}/kg • {o.score} pts</div><div className="text-xs text-gray-500">{o.process} • {o.farm} • {o.required_bags} Bags</div></div><div className="flex gap-2"><Link href={`/lot/${o.id}?room=${room.id}`} className="h-7 px-3 border border-black rounded-full text-xs flex items-center">View Coffee →</Link>{existingPO? <span className="h-7 px-3 border rounded-full text-xs bg-green-50 border-green-200 text-green-700 flex items-center">PO ✓ Approved</span> : <PurchaseOrderButton roomId={room.id} buyerEmail={buyerEmail} offerId={o.id} price={o.price_per_kg||o.price} purchaseOrder={null} />}</div></div>})}
        </div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b font-bold text-sm">Purchase Orders • {purchaseOrders?.length||0}</div>{purchaseOrders?.map((p:any)=><div key={p.id} className="px-4 py-3 flex justify-between items-center text-sm border-b"><span>{p.id.slice(0,8)} • {p.status} • ${p.price}/kg</span><Link href={`/po/${p.id}`} className="h-7 px-3 border border-black rounded-full text-xs flex items-center">View PO →</Link></div>)}</div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b font-bold text-sm">Contracts • {contracts.length}</div>{contracts.map((c:any)=><div key={c.id} className="px-4 py-3 flex justify-between items-center text-sm border-b"><span>{c.contract_number} • {c.status}</span><Link href={`/contract/${c.id}`} className="h-7 px-3 border border-black rounded-full text-xs flex items-center">View Contract →</Link></div>)}</div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b font-bold text-sm">Logistics • {logistics.length}</div>{logistics.map((l:any)=><div key={l.id} className="px-4 py-3 flex justify-between items-center text-sm border-b"><span>{l.booking_number} • {l.status}</span><Link href={`/logistics/${l.id}`} className="h-7 px-3 border border-black rounded-full text-xs flex items-center">View Logistics →</Link></div>)}</div>
      </div>
    </main>
  );
}
