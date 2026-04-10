export default function MapScreen({ isActive, setScreen, showList, setShowList, time }) {
  return (
    <section
      className={`screen app ${isActive ? 'active' : ''}`}
      aria-label="Rastreamento do ônibus"
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
          Linha UFLA
        </div>
        <span className="status online" role="status" aria-live="polite">
          <span className="dot" aria-hidden="true" />
          Online
        </span>
      </header>

      <main>
        <div className="bus-status" role="status">
          Ônibus em rota
        </div>

        <iframe
          src="https://thingsboard.cloud/dashboard/33dec660-224d-11f1-9cdc-43ca8fc8dcc9?publicId=73820a50-31e5-11f1-bbfc-9dee6dc65253"
          id="map"
          title="Mapa de localização do ônibus em tempo real"
          loading="lazy"
        />

        <div className="info-cards" role="list">
          <div className="card" role="listitem">
            <p>Próximo Ponto</p>
            <h3>UFLA Paraíso</h3>
          </div>
          <div className="card" role="listitem">
            <p>Tempo Estimado</p>
            <h3 className="green">2 min</h3>
          </div>
          <div className="card" role="listitem">
            <p>Última Atualização</p>
            <h3 id="time" aria-live="polite">{time}</h3>
          </div>
          <div className="card" role="listitem">
            <p>Valor da Tarifa</p>
            <h3>R$ 3,45</h3>
          </div>
        </div>

        <div className="list">
          <button
            className={`toggle-btn${showList ? ' open' : ''}`}
            onClick={() => setShowList(!showList)}
            aria-expanded={showList}
            aria-controls="points"
          >
            <span>{showList ? 'Ocultar pontos' : 'Ver próximos pontos'}</span>
            <span className="toggle-icon" aria-hidden="true">{showList ? '▲' : '▼'}</span>
          </button>
          <ul id="points" className={showList ? 'show' : ''} aria-label="Próximos pontos do ônibus">
            <li><span>UFLA Paraíso</span><span>2 min</span></li>
            <li><span>Centro</span><span>5 min</span></li>
            <li><span>Rodoviária</span><span>10 min</span></li>
          </ul>
        </div>
      </main>
    </section>
  )
}
