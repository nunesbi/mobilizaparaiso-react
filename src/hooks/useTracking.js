import { useState, useEffect } from 'react';
import { MOCK_BUS_ROUTE, ENABLE_MOCK_BUS } from '../data/mockData';
import { APP_CONFIG } from '../config/constants';

/**
 * Hook para gerenciar o rastreamento do ônibus e do usuário
 */
export function useTracking() {
  const [busLocation, setBusLocation] = useState(MOCK_BUS_ROUTE[0]);
  const [userLocation, setUserLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState('--:--');

  useEffect(() => {
    let routeIndex = 0;
    let intervalId;
    
    // Função para buscar dados reais do ThingsBoard
    const fetchRealLocation = async () => {
      try {
        const { HOST, DEVICE_ID, ACCESS_TOKEN } = APP_CONFIG.THINGSBOARD;
        
        // Endpoint padrão do ThingsBoard para pegar as últimas telemetrias
        const url = `${HOST}/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=latitude,longitude`;
        
        const response = await fetch(url, {
          headers: {
            'X-Authorization': `Bearer ${ACCESS_TOKEN}` // Ou JWT token se necessário
          }
        });

        if (!response.ok) throw new Error('Falha ao buscar coordenadas');

        const data = await response.json();

        if (data.latitude && data.longitude) {
          const newLoc = {
            lat: parseFloat(data.latitude[0].value),
            lng: parseFloat(data.longitude[0].value)
          };
          setBusLocation(newLoc);
          setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (error) {
        console.error("Erro na API ThingsBoard:", error);
      }
    };

    if (ENABLE_MOCK_BUS) {
      // Modo Simulação
      intervalId = setInterval(() => {
        routeIndex = (routeIndex + 1) % MOCK_BUS_ROUTE.length;
        setBusLocation(MOCK_BUS_ROUTE[routeIndex]);
        setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }, 3000);
    } else {
      // Modo Real (ThingsBoard)
      fetchRealLocation(); // Primeira busca imediata
      intervalId = setInterval(fetchRealLocation, APP_CONFIG.THINGSBOARD.POLLING_INTERVAL_MS);
    }

    // Geolocalização do Usuário (Nativo do Browser)
    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error("Erro GPS:", err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { busLocation, userLocation, currentTime };
}
