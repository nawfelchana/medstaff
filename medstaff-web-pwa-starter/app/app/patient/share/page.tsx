'use client';

import { useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function SharePage() {
  const [token, setToken] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const generate = async () => {
    setMsg(null);
    // V1 web: on génère côté client (DB insert via RLS). V2: utiliser Edge Function.
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (!uid) return setMsg("Non connecté.");

    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("qr_share_tokens")
      .insert({ patient_id: uid, expires_at })
      .select("token, expires_at")
      .single();

    if (error) return setMsg(error.message);
    setToken(data.token);
    setMsg(`Valable jusqu’au ${data.expires_at}`);
  };

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Partager mon dossier</h2>
        <p className="small">
          Génère un token valable 24h. V2: affichage QR code + token “one-time-use” renforcé via Edge Function.
        </p>
        <button className="btn" onClick={generate}>Générer un token 24h</button>

        {token && (
          <div className="card" style={{ marginTop: 12 }}>
            <b>Token</b>
            <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", marginTop: 6 }}>{token}</div>
            {msg && <div className="small" style={{ marginTop: 8 }}>{msg}</div>}
          </div>
        )}

        {!token && msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </main>
  );
}
