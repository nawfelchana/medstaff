'use client';

import { useState } from "react";
import { supabase, Role } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const save = async (role: Role) => {
    setMsg(null);
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return router.push("/auth/login");

    const payload: any = { id: user.id, role, full_name: fullName || null, city: city || null };
    if (role !== "patient") payload.specialty = specialty || null;

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) return setMsg(error.message);
    router.push("/app");
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Créer ton profil</h2>

        <div className="grid2">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Infos</h3>
            <label>Nom complet</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <div style={{ height: 10 }} />
            <label>Ville</label>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
            <div style={{ height: 10 }} />
            <label>Spécialité (si pro)</label>
            <input className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Choisir</h3>
            <button className="btn" style={{ width: "100%", marginBottom: 10 }} onClick={() => save("patient")}>
              Je suis patient
            </button>
            <button className="btn secondary" style={{ width: "100%" }} onClick={() => save("pro_pending")}>
              Je suis professionnel (à vérifier)
            </button>
            <p className="small" style={{ marginTop: 12 }}>
              V1: la vérification pro se fait via la table <code>professional_verification</code>.
            </p>
          </div>
        </div>

        {msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </main>
  );
}
