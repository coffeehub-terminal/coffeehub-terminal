import { supabase } from "@/lib/supabase"; import Link from "next/link";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let { data: c } = await supabase.from("Contracts").select("*").eq("id", id).maybeSingle();
  if(!c){ const {data:b}=await supabase.from("Contracts").select("*").eq("contract_number", id).maybeSingle(); c=b; }
  if(!c) return <main className="p-10 text-sm">Contract {id} - Not created yet. Empty form, not 404.<br/><Link href="/" className="mt-4 inline-block border rounded-full px-4 py-2 text-xs">← Back</Link></main>;
  return (
    <main className="min-h-screen bg-white"><div className="border-b h- flex items-center px-6"><span className="font-bold">CH</span></div>
      <div className="max-w- mx-auto p-6"><h1 className="text- font-bold">{c.contract_number||c.id.slice(0,8)} • {c.status}</h1>
        <div className="mt-6 border border-black rounded-xl grid grid-cols-2 text-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-r"><div className="text-xs text-neutral-400">INCOTERM</div><div>{c.incoterm||"- (empty but no 404)"}</div></div>
          <div className="p-4 border-b"><div className="text-xs text-neutral-400">SHIPMENT</div><div>{c.shipment_window||"-"}</div></div>
          <div className="p-4 border-b border-r"><div className="text-xs text-neutral-400">PAYMENT</div><div>{c.payment_terms||"-"}</div></div>
          <div className="p-4 border-b"><div className="text-xs text-neutral-400">PRICE</div><div>${c.price||"-"}</div></div>
          <div className="p-4 col-span-2"><div className="text-xs text-neutral-400">SPECIAL CONDITIONS</div><div className="mt-2 border rounded-full px-4 py-2.5 min-h-">{c.special_conditions||"-"}</div></div>
        </div>
      </div>
    </main>
  );
}
