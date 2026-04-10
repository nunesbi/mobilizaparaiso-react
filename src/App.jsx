import { useState, useEffect } from 'react'
import './style.css'

const LINES = [
  {
    id: 'ufla',
    label: '00',
    name: 'UFLA Paraíso',
    subtitle: 'Terminal Central - UFLA',
    active: true,
    featured: true,
  },
  { id: '01', label: '01', name: 'São Judas - San Genaro', subtitle: null, active: false },
  { id: '02', label: '02', name: 'São Judas / Diamantina', subtitle: 'Bela Vista / Morumbi', active: false },
  { id: '03', label: '03', name: 'Rosentina / Veneza', subtitle: 'Belvedere / Itamaraty', active: false },
  { id: '04', label: '04', name: 'Diamantina - Upa', subtitle: null, active: false },
  { id: '05', label: '05', name: 'São Judas / Santa Tereza', subtitle: 'Verona', active: false },
  { id: 'est', label: 'EST.', name: 'Morumbi - Itamaraty', subtitle: null, active: false },
]

export default function App() {
  const [screen, setScreen] = useState('splash')   // splash | selection | map | unavailable
  const [search, setSearch] = useState('')
  const [selectedLine, setSelectedLine] = useState(null)
  const [showList, setShowList] = useState(false)
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const i = setInterval(() => {
      fetch('http://localhost:3000/location')
        .then(r => r.json())
        .then(d => d.time && setTime(d.time))
        .catch(() => { })
    }, 2000)
    return () => clearInterval(i)
  }, [])

  const filteredLines = LINES.filter(line => {
    const q = search.toLowerCase()
    return (
      line.label.toLowerCase().includes(q) ||
      line.name.toLowerCase().includes(q) ||
      (line.subtitle && line.subtitle.toLowerCase().includes(q))
    )
  })

  const handleLineSelect = (line) => {
    setSelectedLine(line)
    setShowList(false)
    if (line.active) {
      setScreen('map')
    } else {
      setScreen('unavailable')
    }
  }

  return (
    <>
      {/* ================================================
          TELA 1 — SPLASH
      ================================================ */}
      <section
        className={`screen start ${screen === 'splash' ? 'active' : ''}`}
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

      {/* ================================================
          TELA 2 — SELEÇÃO DE LINHA
      ================================================ */}
      <section
        className={`screen selection-screen ${screen === 'selection' ? 'active' : ''}`}
        aria-label="Seleção de linha"
      >
        {/* Header */}
        <header className="header">
          <div>
            <img src="/bus.svg" className="header-icon" alt="" aria-hidden="true" />
            Mobiliza Paraíso
          </div>
          <span className="status online" role="status">
            <span className="dot" aria-hidden="true" />
            Online
          </span>
        </header>

        {/* Título */}
        <div className="sel-hero">
          <h2 className="sel-title">Selecione sua Linha</h2>
          <p className="sel-subtitle">Encontre o trajeto ideal para hoje</p>
        </div>

        {/* Busca */}
        <div className="search-wrap">
          <div className="search-bar">
            <span className="search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Buscar por número ou nome"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar linha"
            />
          </div>
        </div>

        {/* Lista de Linhas */}
        <ul className="lines-list" role="list" aria-label="Linhas disponíveis">
          {filteredLines.length === 0 && (
            <li className="lines-empty">Nenhuma linha encontrada</li>
          )}
          {filteredLines.map(line => (
            <li key={line.id}>
              <button
                className={`line-card${line.featured ? ' line-card--featured' : ''}`}
                onClick={() => handleLineSelect(line)}
                aria-label={`Linha ${line.label}: ${line.name}${line.subtitle ? ' ' + line.subtitle : ''}`}
              >
                <div className={`line-badge${line.featured ? ' line-badge--featured' : ''}`}>
                  <span className="line-badge-label">LINHA</span>
                  <span className="line-badge-num">{line.label}</span>
                </div>
                <div className="line-info">
                  <span className="line-name">{line.name}</span>
                  {line.subtitle && <span className="line-sub">{line.subtitle}</span>}
                </div>
                {!line.active && (
                  <span className="line-lock" aria-hidden="true" title="Linha não rastreada">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ================================================
          TELA 3 — MAPA E INFOS
      ================================================ */}
      <section
        className={`screen app ${screen === 'map' ? 'active' : ''}`}
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

      {/* ================================================
          TELA 4 — LINHA NÃO CADASTRADA
      ================================================ */}
      <section
        className={`screen unavailable-screen ${screen === 'unavailable' ? 'active' : ''}`}
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
    </>
  )
}
