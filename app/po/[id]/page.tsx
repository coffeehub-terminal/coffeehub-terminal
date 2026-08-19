import { supabase } from "@/lib/supabase"; import Link from "next/link";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: po } = await supabase.from("PurchaseOrders").select("*").eq("id", id).maybeSingle();
  if(!po) return <main className="p-10 text-sm">PO {id.slice(0,8)} - Waiting for creation - not 404<br/><Link href="/" className="mt-4 inline-block border rounded-full px-4 py-2 text-xs">← Back</Link></main>;
  return (
    <main className="min-h-screen bg-white"><div className="border-b h- flex items-center px-6 justify-between"><span className="font-bold">CH CoffeeHub</span><Link href={`/r/${po.room_id}`} className="h-8 px-4 border rounded-full text-xs flex items-center">← Back to portal</Link></div>
      <div className="max-w- mx-auto p-6"><h1 className="text- font-bold">{po.id.slice(0,8)} • ${po.price}/kg • {po.status}</h1><div className="text-sm text-neutral-500">{po.room_id} • {po.buyer_email}</div>
        <div className="mt-6 border border-black rounded-xl grid grid-cols-2 text-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-r"><div className="text-xs text-neutral-400">STATUS</div><div className="mt-1">{po.status||"-"}</div></div>
          <div className="p-4 border-b"><div className="text-xs text-neutral-400">QTY / PRICE</div><div className="mt-1">{po.quantity||1} Bags • ${po.price}/kg</div></div>
          <div className="p-4 col-span-2"><div className="text-xs text-neutral-400">OFFER</div><div className="mt-1"><Link href={`/lot/${po.offer_id}?room=${po.room_id}`} className="h-7 px-3 border border-black rounded-full text-xs inline-flex items-center">View Coffee →</Link></div></div>
        </div>
      </div>
    </main>
  );
}
