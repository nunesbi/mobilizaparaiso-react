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
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => {
      const newLog = `[${new Date().toLocaleTimeString('pt-BR')}] ${message}`;
      return [newLog, ...prev].slice(0, 15); // Mantém apenas os últimos 15 logs
    });
  };

  useEffect(() => {
    let routeIndex = 0;
    let intervalId;
    
    let tbToken = null;

    // Função para buscar dados reais do ThingsBoard
    const fetchRealLocation = async () => {
      try {
        const { HOST, DEVICE_ID, USERNAME, PASSWORD } = APP_CONFIG.THINGSBOARD;
        
        // Passo 1: Login para pegar o Token (se ainda não tiver)
        if (!tbToken) {
          addLog("Iniciando Autenticação...");
          const loginResponse = await fetch(`${HOST}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME, password: PASSWORD })
          });

          if (!loginResponse.ok) throw new Error("Falha no login");
          const loginData = await loginResponse.json();
          tbToken = loginData.token;
          addLog("Login Realizado com sucesso.");
        }
        
        // Passo 2: Puxar a telemetria do Dispositivo usando o Token
        const url = `${HOST}/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=latitude,longitude`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Authorization': `Bearer ${tbToken}`
          }
        });

        // Se o token expirou (401), limpa para forçar login na próxima execução
        if (response.status === 401) {
          tbToken = null;
          throw new Error('Token expirado.');
        }

        if (!response.ok) throw new Error('Falha HTTP na telemetria');

        const data = await response.json();

        // Extrai os valores numéricos
        if (data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude[0].value);
          const lng = parseFloat(data.longitude[0].value);
          const newLoc = { lat, lng };
          
          setBusLocation(newLoc);
          setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
          addLog(`Coords recebidas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } else {
           addLog("Sem telemetria recente.");
        }
      } catch (error) {
        addLog(`Erro: ${error.message}`);
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

  return { busLocation, userLocation, currentTime, logs };
}
