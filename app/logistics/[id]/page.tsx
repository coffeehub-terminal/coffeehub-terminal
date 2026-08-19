import { supabase } from "@/lib/supabase"; import Link from "next/link";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let { data: l } = await supabase.from("Logistics").select("*").eq("id", id).maybeSingle();
  if(!l){ const {data:b}=await supabase.from("Logistics").select("*").eq("booking_number", id).maybeSingle(); l=b; }
  if(!l) return <main className="p-10 text-sm">Logistics {id} - Not created yet. Empty form, not 404.<br/><Link href="/" className="mt-4 inline-block border rounded-full px-4 py-2 text-xs">← Back</Link></main>;
  return (
    <main className="min-h-screen bg-white"><div className="border-b h- flex items-center px-6"><span className="font-bold">CH</span></div>
      <div className="max-w- mx-auto p-6"><h1 className="text- font-bold">{l.booking_number||l.id.slice(0,8)} • {l.status}</h1>
        <div className="mt-6 border border-black rounded-xl grid grid-cols-2 text-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-r"><div className="text-xs text-neutral-400">BOOKING</div><div>{l.booking_number||"-"}</div></div>
          <div className="p-4 border-b"><div className="text-xs text-neutral-400">STATUS</div><div>{l.status||"-"}</div></div>
          <div className="p-4 border-b border-r"><div className="text-xs text-neutral-400">CONTAINER</div><div>{l.container_number||"-"} {l.container_size||""}</div></div>
          <div className="p-4 border-b"><div className="text-xs text-neutral-400">VESSEL</div><div>{l.vessel_name||"- (empty but no 404)"}</div></div>
          <div className="p-4 border-r"><div className="text-xs text-neutral-400">ETD</div><div>{l.etd||"-"}</div></div>
          <div className="p-4"><div className="text-xs text-neutral-400">ETA</div><div>{l.eta||"-"}</div></div>
        </div>
      </div>
    </main>
  );
}
