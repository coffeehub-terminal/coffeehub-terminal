"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function PurchaseOrderButton({ roomId, buyerEmail, offerId, price, purchaseOrder }: any) {
  const [loading, setLoading] = useState(false);
  if (purchaseOrder) return <span className="text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">PO Approved ✓</span>;
  const handle = async () => {
    setLoading(true);
    try {
      const { data: po } = await supabase.from("PurchaseOrders").insert({ room_id: roomId, buyer_email: buyerEmail, offer_id: offerId, quantity: 1, price: price||0, status: "Approved" }).select().single();
      if(!po) throw new Error("PO failed");
      const { data: ct } = await supabase.from("Contracts").insert({ purchase_order_id: po.id, room_id: roomId, buyer_email: buyerEmail, status: "Draft", contract_number: `CT-${String(po.id).slice(0,8).toUpperCase()}`, price: price||0 }).select().single();
      await supabase.from("Logistics").insert({ contract_id: ct.id, room_id: roomId, buyer_email: buyerEmail, status: "Booking Requested", booking_number: `BK-${Date.now().toString().slice(-6)}` });
      location.reload();
    } catch(e:any){ alert(e.message); console.error(e) } finally{ setLoading(false) }
  };
  return <button onClick={handle} disabled={loading} className="text-xs px-3 py-1 rounded-full border bg-black text-white">{loading?"Creating...":"Approve PO →"}</button>;
}
