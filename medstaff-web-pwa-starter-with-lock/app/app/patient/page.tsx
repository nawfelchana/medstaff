'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const [nextAppt, setNextAppt] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return router.push("/auth/login");

      const { data: appts } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", uid)
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true })
        .limit(1);

      setNextAppt(appts?.[0] ?? null);
    };
    run();
  }, [router]);

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Espace Patient</h2>
        <div className="card">
          <b>Prochain RDV</b>
          <div className="small">{nextAppt ? `${nextAppt.start_at} (${nextAppt.status})` : "Aucun"}</div>
        </div>

        <div style={{ height: 12 }} />

        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Link className="btn" href="/app/patient/record">Dossier digital</Link>
          <Link className="btn secondary" href="/app/patient/share">Partager (token 24h)</Link>
        </div>

        <p className="small" style={{ marginTop: 12 }}>
          V2: Recherche médecins, forum patients, IA vulgarisation.
        </p>
      </div>
    </main>
  );
}
