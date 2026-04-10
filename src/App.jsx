import { useState, useEffect } from 'react'
import './style.css'

import { LINES } from './data/lines'
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

  useEffect(() => {
    const i = setInterval(() => {
      fetch('http://localhost:3000/location')
        .then(r => r.json())
        .then(d => d.time && setTime(d.time))
        .catch(() => { })
    }, 2000)
    return () => clearInterval(i)
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
      />
      
      <UnavailableScreen
        isActive={screen === 'unavailable'}
        setScreen={setScreen}
        selectedLine={selectedLine}
      />
    </>
  )
}
