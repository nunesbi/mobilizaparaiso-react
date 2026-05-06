import { useState, useEffect } from 'react';
import { MOCK_BUS_ROUTE, ENABLE_MOCK_BUS } from '../data/mockData';

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
    
    // Simulação do Ônibus
    if (ENABLE_MOCK_BUS) {
      intervalId = setInterval(() => {
        routeIndex = (routeIndex + 1) % MOCK_BUS_ROUTE.length;
        setBusLocation(MOCK_BUS_ROUTE[routeIndex]);
        setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }, 3000);
    }

    // Geolocalização do Usuário
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
