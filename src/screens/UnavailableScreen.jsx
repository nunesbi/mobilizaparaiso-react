export default function UnavailableScreen({ isActive, setScreen, selectedLine }) {
  return (
    <section
      className={`screen unavailable-screen ${isActive ? 'active' : ''}`}
      aria-label="Linha não disponível"
    >
      <header className="header">
        <div>
          <button
            className="back-btn"
            onClick={() => setScreen('selection')}
            aria-label="Voltar para seleção de linha"
          >
            <span className="back-btn-icon">‹</span>
            Voltar
          </button>
          <img src="/bus.svg" className="header-icon" alt="" aria-hidden="true" />
          {selectedLine && `Linha ${selectedLine.label}`}
        </div>
        <span className="status online" role="status">
          <span className="dot" aria-hidden="true" />
          Online
        </span>
      </header>

      <div className="unavailable-body">
        <div className="unavailable-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="unavailable-title">Linha não cadastrada</h2>
        <p className="unavailable-sub">
          Esta linha ainda não possui rastreamento em tempo real disponível no Mobiliza Paraíso.
        </p>
        {selectedLine && (
          <div className="unavailable-badge">
            <span className="line-badge-label">LINHA</span>
            <span className="line-badge-num">{selectedLine.label}</span>
          </div>
        )}
        <button
          className="unavailable-back"
          onClick={() => setScreen('selection')}
        >
          Escolher outra linha
        </button>
      </div>
    </section>
  )
}
