'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Role } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AppHome() {
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push("/auth/login");
      const uid = data.session.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .maybeSingle();

      if (!profile) return router.push("/onboarding/role");
      setRole(profile.role);
    };
    run();
  }, [router]);

  if (!role) {
    return (
      <main className="container">
        <div className="card">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Tableau de bord</h2>
        <p>Rôle: <b>{role}</b></p>

        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {role === "patient" ? (
            <Link className="btn" href="/app/patient">Espace Patient</Link>
          ) : (
            <Link className="btn" href="/app/pro">Espace Pro</Link>
          )}
          <button className="btn secondary" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
            Déconnexion
          </button>
        </div>
      </div>
    </main>
  );
}
