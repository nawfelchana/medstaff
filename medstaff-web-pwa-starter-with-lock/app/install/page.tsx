export default function Install() {
  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Installer l’app</h2>
        <div className="grid2">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Android (Chrome)</h3>
            <ol>
              <li>Ouvre <b>app.medstaff.pro</b></li>
              <li>Menu ⋮</li>
              <li><b>Installer l’application</b></li>
            </ol>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>iPhone (Safari)</h3>
            <ol>
              <li>Ouvre <b>app.medstaff.pro</b></li>
              <li>Bouton <b>Partager</b></li>
              <li><b>Sur l’écran d’accueil</b></li>
            </ol>
            <p className="small">Sur iOS, c’est normal qu’il n’y ait pas toujours un bouton “Install”.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
