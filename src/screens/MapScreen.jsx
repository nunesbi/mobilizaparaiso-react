import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MOCK_STOPS } from '../data/mockData';
import { getDistance } from '../utils/geo';
import { sendTelegramMessage } from '../utils/telegram';
import { APP_CONFIG } from '../config/constants';

const containerStyle = {
  width: '100%',
  height: '350px',
  border: '0',
};

export default function MapScreen({ 
  isActive, 
  setScreen, 
  showList, 
  setShowList, 
  time, 
  busLocation, 
  userLocation 
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [eta, setEta] = useState('Calculando...');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  
  const nextStop = MOCK_STOPS[currentStopIndex] || MOCK_STOPS[MOCK_STOPS.length - 1];
  const lastApiCallRef = React.useRef(0);

  useEffect(() => {
    if (!busLocation) return;

    const distToFirst = getDistance(busLocation.lat, busLocation.lng, MOCK_STOPS[0].lat, MOCK_STOPS[0].lng);
    const distToNext = getDistance(busLocation.lat, busLocation.lng, nextStop.lat, nextStop.lng);

    // Lógica de reinício específica para o comportamento do simulador
    if (currentStopIndex === MOCK_STOPS.length - 1 && distToFirst < APP_CONFIG.DISTANCIA_REINICIO_ROTA) {
      sendTelegramMessage(`O ônibus chegou no ponto inicial/final: ${MOCK_STOPS[0].name}`);
      setCurrentStopIndex(0);
    }
    // Avança para o próximo ponto quando o ônibus entra no raio de proximidade
    else if (distToNext < APP_CONFIG.DISTANCIA_PROXIMIDADE_PONTO && currentStopIndex < MOCK_STOPS.length - 1) {
      sendTelegramMessage(`O ônibus chegou no ponto: ${nextStop.name}`);
      setCurrentStopIndex(prev => prev + 1);
    }
  }, [busLocation, currentStopIndex, nextStop]);

  const calculateRoute = useCallback(() => {
    if (!busLocation || !nextStop || !window.google) return;

    lastApiCallRef.current = Date.now();

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
          setEta(result.routes[0].legs[0].duration.text);
        } else {
          console.error(`Erro ao buscar rotas: ${status}`);
        }
      }
    );
  }, [busLocation, nextStop]);

  useEffect(() => {
    if (isLoaded && busLocation) {
      const now = Date.now();
      // Throttling para evitar cobranças excessivas na Google Cloud
      if (now - lastApiCallRef.current > APP_CONFIG.API_THROTTLE_MS) {
        calculateRoute();
      }
    }
  }, [busLocation, isLoaded, calculateRoute]);

  const renderEtaBanner = useMemo(() => {
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
  }, [eta]);

  return (
    <section className={`screen app ${isActive ? 'active' : ''}`} aria-label="Rastreamento do ônibus">
      <header className="header">
        <div>
          <button className="back-btn" onClick={() => setScreen('selection')} aria-label="Voltar">
            <span className="back-btn-icon">‹</span> Voltar
          </button>
          Linha UFLA
        </div>
        <span className="status online" role="status">
          <span className="dot" /> Online
        </span>
      </header>

      <main>
        {renderEtaBanner}

        <div id="map">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={busLocation || APP_CONFIG.DEFAULT_CENTER}
              zoom={16}
              options={{ disableDefaultUI: true, keyboardShortcuts: false, clickableIcons: false }}
            >
              {busLocation && (
                <Marker 
                  position={busLocation} 
                  zIndex={100}
                  icon={{
                    url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              )}

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

              {MOCK_STOPS.map(stop => (
                <Marker key={stop.id} position={{ lat: stop.lat, lng: stop.lng }} title={stop.name} />
              ))}

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
          <InfoCard label="Próximo Ponto" value={nextStop.name} />
          <InfoCard label="Tempo Estimado" value={eta} isGreen />
          <InfoCard label="Última Atualização" value={time} id="time" />
          <InfoCard label="Valor da Tarifa" value={APP_CONFIG.TARIFA_TEXTO} />
        </div>

        <StopList showList={showList} setShowList={setShowList} eta={eta} />
      </main>
    </section>
  );
}

function InfoCard({ label, value, isGreen, id }) {
  return (
    <div className="card" role="listitem">
      <p>{label}</p>
      <h3 className={isGreen ? 'green' : ''} id={id}>{value}</h3>
    </div>
  );
}

function StopList({ showList, setShowList, eta }) {
  return (
    <div className="list">
      <button
        className={`toggle-btn${showList ? ' open' : ''}`}
        onClick={() => setShowList(!showList)}
        aria-expanded={showList}
      >
        <span>{showList ? 'Ocultar pontos' : 'Ver próximos pontos'}</span>
        <span className="toggle-icon">{showList ? '▲' : '▼'}</span>
      </button>
      <ul id="points" className={showList ? 'show' : ''}>
        {MOCK_STOPS.map((stop, index) => (
          <li key={stop.id}>
            <span>{stop.name}</span>
            <span>{index === 0 ? eta : '-- min'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
