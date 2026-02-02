'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function PatientRecordPage() {
  const [loading, setLoading] = useState(true);
  const [allergies, setAllergies] = useState("");
  const [history, setHistory] = useState("");
  const [treatments, setTreatments] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return router.push("/auth/login");

      const { data: rec } = await supabase
        .from("patient_medical_record")
        .select("*")
        .eq("patient_id", uid)
        .maybeSingle();

      if (rec) {
        setAllergies(rec.allergies ?? "");
        setHistory(rec.history ?? "");
        setTreatments(rec.treatments ?? "");
      }
      setLoading(false);
    };
    run();
  }, [router]);

  const save = async () => {
    setMsg(null);
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;

    const { error } = await supabase.from("patient_medical_record").upsert({
      patient_id: uid,
      allergies,
      history,
      treatments,
    });
    if (error) return setMsg(error.message);
    setMsg("Enregistré.");
  };

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Dossier digital</h2>
        {loading ? (
          <div className="card">Chargement...</div>
        ) : (
          <>
            <label>Allergies</label>
            <textarea className="input" style={{ minHeight: 70 }} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            <div style={{ height: 10 }} />

            <label>Antécédents</label>
            <textarea className="input" style={{ minHeight: 90 }} value={history} onChange={(e) => setHistory(e.target.value)} />
            <div style={{ height: 10 }} />

            <label>Traitements</label>
            <textarea className="input" style={{ minHeight: 90 }} value={treatments} onChange={(e) => setTreatments(e.target.value)} />
            <div style={{ height: 12 }} />

            <button className="btn" onClick={save}>Enregistrer</button>
            {msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
          </>
        )}
      </div>
    </main>
  );
}
