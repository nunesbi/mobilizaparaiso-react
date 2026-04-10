export default function SplashScreen({ isActive, setScreen }) {
  return (
    <section
      className={`screen start ${isActive ? 'active' : ''}`}
      aria-label="Tela inicial"
    >
      <div className="center">
        <div className="bus-icon" aria-hidden="true">
          <img src="/bus.svg" alt="" />
        </div>
        <div>
          <h1>Mobiliza Paraíso</h1>
          <p className="splash-sub">Rastreamento do transporte público<br />em tempo real</p>
        </div>
        <button
          className="enter"
          onClick={() => setScreen('selection')}
          aria-label="Acessar rastreamento do ônibus"
        >
          Rastrear ônibus
        </button>
      </div>
    </section>
  )
}
