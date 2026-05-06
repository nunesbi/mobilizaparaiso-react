import { useState, useEffect } from 'react'
import './style.css'

import { LINES } from './data/lines'
import { MOCK_BUS_ROUTE, ENABLE_MOCK_BUS } from './data/mockData'
import SplashScreen from './screens/SplashScreen'
import SelectionScreen from './screens/SelectionScreen'
import MapScreen from './screens/MapScreen'
import UnavailableScreen from './screens/UnavailableScreen'

export default function App() {
  const [screen, setScreen] = useState('splash')   // splash | selection | map | unavailable
  const [search, setSearch] = useState('')
  const [selectedLine, setSelectedLine] = useState(null)
  const [showList, setShowList] = useState(false)
  const [time, setTime] = useState('--:--')
  
  const [busLocation, setBusLocation] = useState(MOCK_BUS_ROUTE[0])
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    let routeIndex = 0;
    let i;
    
    if (ENABLE_MOCK_BUS) {
      i = setInterval(() => {
        routeIndex = (routeIndex + 1) % MOCK_BUS_ROUTE.length;
        setBusLocation(MOCK_BUS_ROUTE[routeIndex]);
        setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }, 3000);
    } else {
      // Para uso futuro com dados reais:
      // Pode substituir por um fetch para a API do ThingsBoard
      setBusLocation(MOCK_BUS_ROUTE[0]); // Mantém um local fixo se o simulador estiver desligado
    }

    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => {
        console.error("Erro ao obter geolocalização:", err);
      }, { enableHighAccuracy: true });
    }

    return () => {
      clearInterval(i)
      if (watchId !== undefined && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    }
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
      <SplashScreen
        isActive={screen === 'splash'}
        setScreen={setScreen}
      />
      
      <SelectionScreen
        isActive={screen === 'selection'}
        search={search}
        setSearch={setSearch}
        filteredLines={filteredLines}
        handleLineSelect={handleLineSelect}
      />
      
      <MapScreen
        isActive={screen === 'map'}
        setScreen={setScreen}
        showList={showList}
        setShowList={setShowList}
        time={time}
        busLocation={busLocation}
        userLocation={userLocation}
      />
      
      <UnavailableScreen
        isActive={screen === 'unavailable'}
        setScreen={setScreen}
        selectedLine={selectedLine}
      />
    </>
  )
}
