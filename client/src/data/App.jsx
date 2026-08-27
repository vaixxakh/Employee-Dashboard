import React from 'react'

import FullScreenLoader from '../components/FullScreenLoader'
import AppRoutes from '../components/AppRoutes'
import ScrollToTop from '../components/ScrollToTop'

import '../App.css'
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from '../context/AuthContext.jsx'


export default function App() {

  const [isInitializing, setIsInitializing] = React.useState(true)

    React.useEffect(() => {
    const initializeTimer = window.setTimeout(
      () => setIsInitializing(false),
       650)

    return () => {
      window.clearTimeout(initializeTimer)
    }
  }, []);
 

  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="custom-toast"
        progressClassName="custom-progress"
      />
      <FullScreenLoader isInitializing={isInitializing} />
      <div className={`app-content ${isInitializing 
        ? 'is-initializing' : 'is-ready'}`} 
        aria-busy={isInitializing}>
          
        <ScrollToTop />

        <AppRoutes />
      </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
