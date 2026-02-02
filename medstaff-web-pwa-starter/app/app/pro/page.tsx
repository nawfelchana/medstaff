'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProPage() {
  const [role, setRole] = useState<string>("pro_pending");
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return router.push("/auth/login");

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
      setRole(profile?.role ?? "pro_pending");

      const { data: feed } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(30);
      setPosts(feed ?? []);
    };
    run();
  }, [router]);

  const publish = async () => {
    setMsg(null);
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;

    const text = content.trim();
    if (!text) return;

    const { data: created, error } = await supabase
      .from("posts")
      .insert({ author_id: uid, visibility: "public", content: text })
      .select("*")
      .single();

    if (error) return setMsg(error.message);
    setPosts([created, ...posts]);
    setContent("");
  };

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Espace Pro</h2>
        <p className="small">Statut: <b>{role}</b> (V1: posts publics seulement)</p>

        {role !== "pro_verified" && (
          <div className="card">
            <b>Vérification pro</b>
            <div className="small">V1: upload + validation admin via table professional_verification.</div>
          </div>
        )}

        <textarea className="input" style={{ minHeight: 80 }} placeholder="Écrire un post..." value={content} onChange={(e) => setContent(e.target.value)} />
        <div style={{ height: 10 }} />
        <button className="btn" onClick={publish}>Publier</button>
        {msg && <div className="small" style={{ marginTop: 10 }}>{msg}</div>}

        <div style={{ height: 14 }} />
        <b>Fil</b>

        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {posts.map((p) => (
            <div className="card" key={p.id}>
              <div className="small">{p.created_at}</div>
              <div>{p.content}</div>
            </div>
          ))}
          {posts.length === 0 && <div className="small">Aucun post.</div>}
        </div>
      </div>
    </main>
  );
}
