export default function SelectionScreen({ isActive, search, setSearch, filteredLines, handleLineSelect }) {
  return (
    <section
      className={`screen selection-screen ${isActive ? 'active' : ''}`}
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
  )
}
