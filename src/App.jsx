import { useState, useEffect } from 'react'
import './style.css'

export default function App() {
  const [started, setStarted] = useState(false)
  const [showList, setShowList] = useState(false)
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const i = setInterval(() => {
      fetch('http://localhost:3000/location')
        .then(r => r.json())
        .then(d => d.time && setTime(d.time))
        .catch(() => { }) // silencia erros de rede em dev
    }, 2000)
    return () => clearInterval(i)
  }, [])

  return (
    <>
      {/* ---- TELA INICIAL ---- */}
      <section
        className={`screen start ${!started ? 'active' : ''}`}
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
            onClick={() => setStarted(true)}
            aria-label="Acessar rastreamento do ônibus"
          >
            Rastrear ônibus
          </button>
        </div>
      </section>

      {/* ---- TELA PRINCIPAL ---- */}
      <section
        className={`screen app ${started ? 'active' : ''}`}
        aria-label="Rastreamento do ônibus"
      >
        <header className="header">
          <div>
            <img src="/bus.svg" className="header-icon" alt="" aria-hidden="true" />
            Mobiliza Paraíso
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
    </>
  )
}
