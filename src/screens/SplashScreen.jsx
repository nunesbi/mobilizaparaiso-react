export default function SplashScreen({ isActive, setScreen }) {
  return (
    <section
      className={`screen start ${isActive ? 'active' : ''}`}
      aria-label="Tela inicial"
    >
      {/* Área visual superior — grade de pontos + ícone */}
      <div className="splash-visual">
        <div className="bus-icon" aria-hidden="true">
          <img src="/bus.svg" alt="" />
        </div>

        {/* SVG decorativo de rota de ônibus */}
        <svg
          className="splash-route"
          viewBox="0 0 200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Linha de rota sinuosa */}
          <path
            d="M 180 400 C 160 320, 120 300, 140 220 C 160 140, 100 120, 110 60 C 115 30, 90 10, 60 0"
            stroke="#2DBA67"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
          {/* Pontos de parada na rota */}
          <circle cx="140" cy="220" r="5" fill="#2DBA67" opacity="0.7" />
          <circle cx="98" cy="23" r="5" fill="#2DBA67" opacity="0.5" />
          <circle cx="162" cy="350" r="5" fill="#2DBA67" opacity="0.4" />
        </svg>

        {/* Texto hero — posicionado na parte inferior do visual */}
        <div className="splash-content">
          <p className="splash-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            São Sebastião do Paraíso
          </p>
          <h1>
            Mobiliza <span>Paraíso</span>
          </h1>
          <p className="splash-sub">
            Rastreamento do transporte público em tempo real.
          </p>
        </div>
      </div>

      {/* CTA inferior */}
      <div className="splash-cta">
        <button
          className="enter"
          onClick={() => setScreen('selection')}
          aria-label="Acessar rastreamento do ônibus"
        >
          <span>Rastrear ônibus</span>
          <span className="enter-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
