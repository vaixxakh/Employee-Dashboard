import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import FullScreenLoader from '../components/FullScreenLoader'
import AppRoutes from '../components/AppRoutes'
import ScrollToTop from '../components/ScrollToTop'



import '../App.css'

export default function App() {
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [isDirectoryLoading, setIsDirectoryLoading] =React.useState(true)
const [employees, setEmployees] = React.useState([]);

   React.useEffect(() => {
  const storedEmployees =
    JSON.parse(localStorage.getItem("employees")) || [];

  setEmployees(storedEmployees);
}, []);

    React.useEffect(() => {
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
        <AppRoutes employees={employees} setEmployees={setEmployees}
         isDirectoryLoading={isDirectoryLoading} />
      </div>
    </BrowserRouter>
  )
}
