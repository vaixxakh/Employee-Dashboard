import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import FullScreenLoader from '../components/FullScreenLoader'
import AppRoutes from '../components/AppRoutes'
import ScrollToTop from '../components/ScrollToTop'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


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
  }, []);

      const handleDeleteEmployee = (employeeId) => {
      const employeeExists = employees.some(
        (employee) => employee.id === employeeId
      )

      if (!employeeExists) {
        return false
      }

      const updatedEmployees = employees.filter(
        (employee) => employee.id !== employeeId
      )

      setEmployees(updatedEmployees)

      localStorage.setItem(
        'employees',
        JSON.stringify(updatedEmployees)
      )

      return true
    }

  return (
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
      <div className={`app-content ${isInitializing ? 'is-initializing' : 'is-ready'}`} aria-busy={isInitializing || isDirectoryLoading}>
        <ScrollToTop />
        <AppRoutes employees={employees} setEmployees={setEmployees}
        handleDeleteEmployee={handleDeleteEmployee}
         isDirectoryLoading={isDirectoryLoading} />
      </div>
    </BrowserRouter>
  )
}
