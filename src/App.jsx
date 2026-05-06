import { useState } from 'react'
import './style.css'

import { LINES } from './data/lines'
import { useTracking } from './hooks/useTracking'

import SplashScreen from './screens/SplashScreen'
import SelectionScreen from './screens/SelectionScreen'
import MapScreen from './screens/MapScreen'
import UnavailableScreen from './screens/UnavailableScreen'

export default function App() {
  const [screen, setScreen] = useState('splash') // splash | selection | map | unavailable
  const [selectedLine, setSelectedLine] = useState(null)
  
  const [search, setSearch] = useState('')
  const [showList, setShowList] = useState(false)
  
  const { busLocation, userLocation, currentTime } = useTracking()

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
    setScreen(line.active ? 'map' : 'unavailable')
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
        time={currentTime}
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
