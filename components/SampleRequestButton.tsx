"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createActivity } from "../lib/activity";

interface Offer { id: string; lot_number: string; }
interface Props { roomId: string; buyerEmail: string; offers: Offer[]; }

export default function SampleRequestButton({ roomId, buyerEmail, offers }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function requestSamples() {
    if (loading) return;
    setLoading(true);
    try {
      const { data: existingRequest, error: existingError } = await supabase
      .from("SampleRequests").select("id").eq("room_id", roomId).limit(1);
      if (existingError) throw existingError;
      if (existingRequest && existingRequest.length > 0) {
        alert("A sample request already exists for this room.");
        router.refresh();
        return;
      }

      const { data: sampleRequest, error: requestError } = await supabase
      .from("SampleRequests")
      .insert({ room_id: roomId, buyer_email: buyerEmail, status: "Approved", notes: "" })
      .select().single();
      if (requestError) throw requestError;

      const rows = offers.map((offer) => ({
        sample_request_id: sampleRequest.id,
        offer_id: offer.id,
      }));
      const { error: offerError } = await supabase.from("SampleRequestOffers").insert(rows);
      if (offerError) throw offerError;

      // CREATE Samples row so buyer portal shows Preparing/Shipped
      const { data: sampleRow } = await supabase.from("Samples").insert({
        sample_request_id: sampleRequest.id,
        room_id: roomId,
        buyer_email: buyerEmail,
        status: "Preparing",
        courier: "",
        tracking_number: "",
        notes: ""
      }).select().single();

      // ---- FIX: notify seller via Resend ----
      fetch("/api/send-sample-request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          roomId,
          buyerEmail,
          offerIds: offers.map(o=>o.lot_number).join(", "),
          buyerLink: `${window.location.origin}/samples`
        })
      }).catch(()=>{})

      await createActivity({
        entityType: "SampleRequest",
        entityId: sampleRequest.id,
        roomId: roomId,
        action: "requested",
        title: "New Sample Request",
        description: `${buyerEmail} requested samples.`,
        link: "/sample-requests",
        createdBy: buyerEmail,
      });

      alert("Sample request submitted successfully.");
      router.refresh();
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Unable to submit sample request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={requestSamples}
      disabled={loading}
      className="h-9 px-4 rounded-full bg-[#111] text-white text- font-medium hover:bg-black disabled:opacity-50 transition"
    >
      {loading? "Submitting..." : "Request Sample"}
    </button>
  );
}