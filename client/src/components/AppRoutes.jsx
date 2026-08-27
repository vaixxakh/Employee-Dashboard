import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import AppLayout from './AppLayout'
import DashboardPage from '../pages/DashboardPage'
import EmployeeDetailsPage from './EmployeeDetailsPage'
import EmployeeDirectoryPage from './EmployeeDirectoryPage'
import AddEmployee from '../pages/AddEmployee'
import NotFoundPage from './NotFoundPage'
import EditEmployee from '../pages/EditEmployee'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
import { EmployeeProvider } from '../context/EmployeeContext'
import { useAuth } from '../hooks/useAuth'

function EmployeeProviderLayout() {
  return (
    <EmployeeProvider>
      <Outlet />
    </EmployeeProvider>
  )
}

function AdminOnly({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'Admin') return <Navigate to="/employees" replace />
  return children
}

export default function AppRoutes() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }
  const animation = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div className="route-transition" key={location.pathname} transition={transition} {...animation}>

        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<EmployeeProviderLayout />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />

                <Route path="/employees" element={<EmployeeDirectoryPage />} />

                <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />

                <Route path="/employees/add" element={<AdminOnly><AddEmployee /></AdminOnly>} />

                <Route path="/employees/:employeeId/edit" element={<AdminOnly><EditEmployee /></AdminOnly>} />
              </Route>
            </Route>
          </Route>

          <Route path="/not-found" element={<NotFoundPage />} />

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
