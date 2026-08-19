"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PurchaseOrderButton({ roomId, buyerEmail, offerId, price, purchaseOrder }: any) {
  const [loading, setLoading] = useState(false);
  if (purchaseOrder) return <span className="text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">PO ✓ {purchaseOrder.status}</span>;

  const handle = async () => {
    setLoading(true);
    try {
      const email = buyerEmail || "buyer@example.com";
      
      const { data: po, error: poErr } = await supabase
        .from("PurchaseOrders")
        .insert({ room_id: roomId, buyer_email: email, offer_id: offerId, quantity: 1, price, status: "Approved" })
        .select()
        .single();
      if (poErr) throw new Error(`PO: ${poErr.message}`);

      const { data: ct, error: ctErr } = await supabase
        .from("Contracts")
        .insert({ purchase_order_id: po.id, room_id: roomId, buyer_email: email, status: "Draft", contract_number: `CT-${po.id.slice(0,8).toUpperCase()}` })
        .select()
        .single();
      if (ctErr) throw new Error(`Contract: ${ctErr.message}`);

      const { error: logErr } = await supabase
        .from("Logistics")
        .insert({ contract_id: ct.id, room_id: roomId, buyer_email: email, status: "Booked", booking_number: `BK-${Date.now().toString().slice(-6)}` });
      if (logErr) throw new Error(`Logistics: ${logErr.message}`);

      location.reload();
    } catch (e: any) {
      alert(`PO insert failed: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handle} disabled={loading} className="h-7 px-3 border border-black rounded-full text-xs bg-black text-white">{loading ? "Creating..." : `Buy $${price}/kg → Accept Offer`}</button>;
}