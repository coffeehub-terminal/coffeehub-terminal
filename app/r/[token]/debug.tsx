"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function Debug(){
  const { token } = useParams() as any;
  const [out,setOut]=useState<any>({});
  useEffect(()=>{
    (async()=>{
      const a = await supabase.from("Rooms").select("id,name").limit(10);
      const b = await supabase.from("Rooms").select("*").eq("id", token).maybeSingle();
      const c = await supabase.from("Rooms").select("*").or(`id.eq.${token}`).maybeSingle();
      setOut({ token, list: a.data, byId: b.data, byOr: c.data, errB: b.error, errC: c.error });
    })()
  },[token]);
  return <pre className="p-5 text-xs whitespace-pre-wrap">{JSON.stringify(out,null,2)}</pre>
}
