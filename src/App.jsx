import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import FullScreenLoader from './components/FullScreenLoader'
import AppRoutes from './components/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import employees from './data/employees'
import './App.css'

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(true)

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => setIsInitializing(false), 650)
    const directoryTimer = window.setTimeout(() => setIsDirectoryLoading(false), 1100)

    return () => {
      window.clearTimeout(initializeTimer)
      window.clearTimeout(directoryTimer)
    }
  }, [])

  return (
    <BrowserRouter>
      <FullScreenLoader isLoading={isInitializing} />
      <div className={`app-content ${isInitializing ? 'is-initializing' : 'is-ready'}`} aria-busy={isInitializing || isDirectoryLoading}>
        <ScrollToTop />
        <AppRoutes employees={employees} isDirectoryLoading={isDirectoryLoading} />
      </div>
    </BrowserRouter>
  )
}
