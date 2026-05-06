import React, { useState, useEffect, useCallback } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MOCK_STOPS } from '../data/mockData';

const containerStyle = {
  width: '100%',
  height: '350px', // Maior que os 300px do pai para esconder o rodapé
  border: '0',
};

const center = {
  lat: -20.899853,
  lng: -46.987238
};

export default function MapScreen({ isActive, setScreen, showList, setShowList, time, busLocation, userLocation }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [eta, setEta] = useState('Calculando...');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const nextStop = MOCK_STOPS[currentStopIndex] || MOCK_STOPS[MOCK_STOPS.length - 1];
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Função utilitária para calcular distância em metros (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
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

  const lastBusLocation = React.useRef(null);

  useEffect(() => {
    if (!busLocation) return;

    const distToFirst = getDistance(busLocation.lat, busLocation.lng, MOCK_STOPS[0].lat, MOCK_STOPS[0].lng);
    const distToNext = getDistance(busLocation.lat, busLocation.lng, nextStop.lat, nextStop.lng);

    // Se o ônibus chegar ao fim da rota (UFLA) e o simulador o teleportar
    // de volta para o ponto de Início (que fica a aprox 260m do Fórum), nós reiniciamos:
    if (currentStopIndex === MOCK_STOPS.length - 1 && distToFirst < 350) {
      setCurrentStopIndex(0);
    }
    // Se chegou muito perto do próximo ponto (menos de 60m), avança para o seguinte
    else if (distToNext < 60 && currentStopIndex < MOCK_STOPS.length - 1) {
      setCurrentStopIndex(prev => prev + 1);
    }
  }, [busLocation, currentStopIndex, nextStop]);

  const calculateRoute = useCallback(() => {
    if (!busLocation || !nextStop || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: busLocation,
        destination: { lat: nextStop.lat, lng: nextStop.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          const duration = result.routes[0].legs[0].duration.text;
          setEta(duration);
        } else {
          console.error(`Erro ao buscar rotas: ${status}`);
        }
      }
    );
  }, [busLocation, nextStop]);

  useEffect(() => {
    if (isLoaded && busLocation) {
      calculateRoute();
    }
  }, [busLocation, isLoaded, calculateRoute]);

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
        {/* Barra de Status Dinâmica baseada no ETA */}
        {(() => {
          const minutesMatch = eta.match(/\d+/);
          const minutes = minutesMatch ? parseInt(minutesMatch[0], 10) : 99;
          
          let statusText = eta;
          let isArriving = false;
          
          if (eta === 'Calculando...') {
            statusText = "Calculando tempo...";
          } else if (eta.includes('hora')) {
            statusText = `Chega em ${eta}`;
          } else if (minutes <= 3) {
            statusText = "Ônibus chegando!";
            isArriving = true;
          } else {
            statusText = `Chega em ${eta}`;
          }

          return (
            <div
              className={`eta-banner ${isArriving ? 'eta-banner--arriving' : ''}`}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </div>
          );
        })()}

        <div id="map">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={busLocation || center}
              zoom={16}
              options={{
                disableDefaultUI: true,
                keyboardShortcuts: false,
                clickableIcons: false
              }}
            >
              {/* Marcador do Ônibus */}
              {busLocation && (
                <Marker
                  position={busLocation}
                  icon={{
                    url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                  zIndex={100}
                />
              )}

              {/* Marcador do Usuário */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 8
                  }}
                />
              )}

              {/* Paradas de Ônibus */}
              {MOCK_STOPS.map(stop => (
                <Marker
                  key={stop.id}
                  position={{ lat: stop.lat, lng: stop.lng }}
                  title={stop.name}
                />
              ))}

              {/* Rota */}
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    suppressMarkers: true,
                    preserveViewport: true,
                    polylineOptions: { strokeColor: '#00a35c', strokeWeight: 5 }
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>Carregando Mapa...</div>
          )}
        </div>

        <div className="info-cards" role="list">
          <div className="card" role="listitem">
            <p>Próximo Ponto</p>
            <h3>{nextStop.name}</h3>
          </div>
          <div className="card" role="listitem">
            <p>Tempo Estimado</p>
            <h3 className="green">{eta}</h3>
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
            {MOCK_STOPS.map((stop, index) => (
              <li key={stop.id}><span>{stop.name}</span><span>{index === 0 ? eta : '-- min'}</span></li>
            ))}
          </ul>
        </div>
      </main>
    </section>
  )
}
