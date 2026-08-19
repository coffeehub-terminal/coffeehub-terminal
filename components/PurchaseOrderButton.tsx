"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PurchaseOrderButton({ roomId, buyerEmail, offerId, price, purchaseOrder }: any) {
  const [loading, setLoading] = useState(false);
  if (purchaseOrder) return <span className="text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">PO ✓ {purchaseOrder.status}</span>;

  const handle = async () => {
    setLoading(true);
    try {
      const safeEmail = buyerEmail || "buyer@example.com";
      if (!roomId || !offerId) throw new Error("Missing roomId/offerId");

      // 1. Create PO - try both column names to match your Supabase schema
      const { data: po, error: poErr } = await supabase
        .from("PurchaseOrders")
        .insert({ 
          id: `PO-${Date.now()}`,
          room_id: roomId, 
          buyer_email: safeEmail, 
          offer_id: offerId, 
          quantity: 1,
          quantity_bags: 1,
          price: price,
          price_per_kg: price,
          status: "Approved",
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (poErr) throw new Error("PO insert failed: " + poErr.message);
      if (!po?.id) throw new Error("PO returned null - check RLS policies");

      // 2. Create Contract
      const { data: ct, error: ctErr } = await supabase
        .from("Contracts")
        .insert({ 
          id: `CT-${Date.now()}`,
          purchase_order_id: po.id, 
          room_id: roomId, 
          buyer_email: safeEmail, 
          status: "Draft", 
          contract_number: `CT-${String(po.id).slice(0,8).toUpperCase()}`,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (ctErr) throw new Error("Contract failed: " + ctErr.message);

      // 3. Create Logistics
      const { error: logErr } = await supabase.from("Logistics").insert({ 
        id: `LOG-${Date.now()}`,
        contract_id: ct.id, 
        room_id: roomId, 
        buyer_email: safeEmail, 
        status: "Booked", 
        booking_number: `BK-${Date.now().toString().slice(-6)}`,
        created_at: new Date().toISOString()
      });

      if (logErr) throw new Error("Logistics failed: " + logErr.message);

      location.reload();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handle} disabled={loading} className="h-7 px-3 border border-black rounded-full text-xs bg-black text-white hover:bg-gray-800">{loading ? "Creating..." : "Buy $" + price + "/kg → Accept Offer"}</button>;
}