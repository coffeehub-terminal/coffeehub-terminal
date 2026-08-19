import { supabase } from "@/lib/supabase";
import SampleRequestButton from "@/components/SampleRequestButton";
import PurchaseOrderButton from "@/components/PurchaseOrderButton";
import Link from "next/link";

export default async function RoomPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: room } = await supabase.from("Rooms").select("*").eq("share_token", token).maybeSingle();
  if(!room) return <main className="min-h-screen p-10 text-sm">Room not found {token} - run the RLS SQL above</main>;

  const { data: participants } = await supabase.from("RoomParticipants").select("*").eq("room_id", room.id);
  const offerIds = (room.offer_ids||"").split(",").map((s:string)=>s.trim()).filter(Boolean);
  const { data: offers } = await supabase.from("Offers").select("*").in("id", offerIds.length?offerIds:["NONE"]);

  const { data: samples } = await supabase.from("Samples").select("*").eq("room_id", room.id).order("created_at",{ascending:false});
  const existingSample = samples?.[0]||null;
  const { data: sampleRequests } = await supabase.from("SampleRequests").select("*").eq("room_id", room.id).order("created_at",{ascending:false}).limit(1);
  const existingRequest = sampleRequests?.[0]||null;
  const { data: purchaseOrders } = await supabase.from("PurchaseOrders").select("*").eq("room_id", room.id);
  let contracts:any[]=[]; let logistics:any[]=[];
  if(purchaseOrders?.length){
    const { data: c } = await supabase.from("Contracts").select("*").in("purchase_order_id", purchaseOrders.map((p:any)=>p.id));
    if(c) contracts=c;
    if(c?.length){
      const { data: l } = await supabase.from("Logistics").select("*").in("contract_id", c.map((x:any)=>x.id));
      if(l) logistics=l;
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-black h- flex items-center px-6">
        <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-xs">CH</div>
        <span className="ml-2 font-bold text-sm">CoffeeHub Buyer Portal</span>
        <span className="ml-3 text- border border-black rounded-full px-2.5 py-1">{room.id} • {room.status}</span>
      </div>
      <div className="max-w- mx-auto p-6 space-y-5">
        <div className="border border-black rounded-lg p-4">
          <div className="flex justify-between"><b className="text-sm">Sample Shipment — <span className="text-green-700">{existingSample?.status||"Preparing"}</span></b><span className="text-xs border border-green-200 bg-green-50 text-green-700 rounded-full px-2 py-1">{existingSample?.status||"Preparing"}</span></div>
          <div className="flex gap-2 mt-4"><div className="h-2 flex-1 bg-[#00d26a] rounded-full"/><div className="h-2 flex-1 bg-[#00d26a] rounded-full"/><div className="h-2 flex-1 bg-gray-200 rounded-full"/><div className="h-2 flex-1 bg-gray-200 rounded-full"/></div>
          <div className="flex gap-2 mt-2 text-xs text-gray-500"><span className="flex-1">Requested</span><span className="flex-1">Preparing</span><span className="flex-1">Shipped</span><span className="flex-1">Delivered</span></div>
          <div className="mt-4 bg-[#f6fef9] border border-green-50 rounded-xl p-4 text-sm"><div>Courier: <b>{existingSample?.courier||"— To be updated by exporter"}</b></div><div>Tracking: <b>{existingSample?.tracking_number||"—"}</b></div></div>
        </div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b border-black font-bold text-sm">Available Coffees</div>{offers?.map((o:any)=><div key={o.id} className="px-4 py-4 border-b"><div className="text-sm font-medium">{o.lot_number} • {o.origin} • ${o.price_per_kg}/kg • {o.score} pts</div><div className="text-xs text-gray-500">{o.process} • {o.farm} • {o.required_bags} Bags • Status {o.status}</div><div className="mt-3 flex gap-2"><Link href={`/lot/${o.id}?room=${room.id}`} className="h-7 px-3 border border-black rounded-full text-xs flex items-center">View Coffee →</Link><PurchaseOrderButton roomId={room.id} buyerEmail={participants?.[0]?.email||""} offerId={o.id} price={o.price_per_kg} purchaseOrder={purchaseOrders?.find((p:any)=>p.offer_id===o.id)} /></div></div>)}</div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b border-black font-bold text-sm">Purchase Orders • {purchaseOrders?.length||0}</div>{purchaseOrders?.map((p:any)=><div key={p.id} className="px-4 py-3 text-sm">{p.id.slice(0,8)} • {p.status}</div>)}</div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b border-black font-bold text-sm">Contracts • {contracts.length}</div>{contracts.map((c:any)=><div key={c.id} className="px-4 py-3 text-sm">{c.contract_number||c.id} • {c.status}</div>)}</div>
        <div className="border border-black rounded-lg overflow-hidden"><div className="px-4 py-3 border-b border-black font-bold text-sm">Logistics • {logistics.length}</div>{logistics.map((l:any)=><div key={l.id} className="px-4 py-3 text-sm">{l.status} • {l.booking_number}</div>)}</div>
      </div>
    </main>
  );
}