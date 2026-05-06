/**
 * Utilitários geográficos e matemáticos
 */

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine (em metros)
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raio da Terra em metros
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const deltaP = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) * Math.cos(p2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
