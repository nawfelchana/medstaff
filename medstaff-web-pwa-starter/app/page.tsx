import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>MedStaff (Web App)</h1>
        <p>
          Ouvre ce site sur ton téléphone pour l’installer comme une application (PWA).
        </p>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Link className="btn" href="/auth/login">Se connecter</Link>
          <Link className="btn secondary" href="/install">Comment installer</Link>
        </div>
        <p className="small" style={{ marginTop: 12 }}>
          Conseil: héberge sur <b>HTTPS</b> (Vercel/Netlify) pour permettre l’installation.
        </p>
      </div>
    </main>
  );
}
