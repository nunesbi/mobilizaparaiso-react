export const ENABLE_MOCK_BUS = false;

export const MOCK_STOPS = [
  { id: 1, name: 'Fórum', lat: -20.903281, lng: -46.987238 },
  { id: 2, name: 'Cond. Atenas', lat: -20.895869, lng: -46.984299 },
  { id: 3, name: 'UFLA', lat: -20.899853, lng: -46.989985 }
]

// Rota simulada do ônibus (pontos que o ônibus vai percorrer)
export const MOCK_BUS_ROUTE = [
  { lat: -20.905000, lng: -46.989000 }, // Início (antes do Fórum)
  { lat: -20.904100, lng: -46.988100 },
  { lat: -20.903281, lng: -46.987238 }, // Fórum (ID 1)
  { lat: -20.901600, lng: -46.986300 }, // <-- Ponto intermediário novo
  { lat: -20.900000, lng: -46.985500 },
  { lat: -20.897900, lng: -46.984900 }, // <-- Ponto intermediário novo
  { lat: -20.895869, lng: -46.984299 }, // Cond. Atenas (ID 2)
  { lat: -20.897500, lng: -46.987000 },
  { lat: -20.898600, lng: -46.988500 }, // <-- Ponto intermediário novo
  { lat: -20.899853, lng: -46.989985 }, // UFLA (ID 3)
]