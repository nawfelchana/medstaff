'use client';

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async () => {
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    router.push("/app");
  };

  const signUp = async () => {
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    setMsg("Compte créé. Reviens te connecter.");
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Connexion</h2>

        <label>Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div style={{ height: 10 }} />

        <label>Mot de passe</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{ height: 12 }} />

        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button className="btn" onClick={signIn}>Se connecter</button>
          <button className="btn secondary" onClick={signUp}>Créer un compte</button>
        </div>

        {msg && <p className="small" style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </main>
  );
}
