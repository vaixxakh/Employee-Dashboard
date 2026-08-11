import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AppLayout from './AppLayout'
import DashboardPage from '../page/DashboardPage'
import EmployeeDetailsPage from './EmployeeDetailsPage'
import EmployeeDirectoryPage from './EmployeeDirectoryPage'
import AddEmployee from '../page/AddEmployee'
import NotFoundPage from './NotFoundPage'
import EditEmployee from '../page/EditEmployee'

function withLayout(content, totalEmployees) {
  return <AppLayout totalEmployees={totalEmployees}>{content}</AppLayout>
}

export default function AppRoutes({ employees, setEmployees, isDirectoryLoading, handleDeleteEmployee }) {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const totalEmployees = employees.length
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }
  const animation = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div className="route-transition" key={location.pathname} transition={transition} {...animation}>

        <Routes location={location}>
          <Route path="/" element={withLayout(<DashboardPage employees={employees} isDirectoryLoading={isDirectoryLoading} />, totalEmployees)} />

          <Route path="/employees" element={withLayout(<EmployeeDirectoryPage employees={employees} isDirectoryLoading={isDirectoryLoading} />, totalEmployees)} />

          <Route path="/employees/:employeeId" element={withLayout(<EmployeeDetailsPage employees={employees} handleDeleteEmployee={handleDeleteEmployee} />, totalEmployees)} />

          <Route path="/employees/add" element={withLayout(<AddEmployee employees={employees}
          setEmployees={setEmployees} />, totalEmployees)} />

          <Route path="/employees/:employeeId/edit" element={withLayout(<EditEmployee employees={employees}
          setEmployees={setEmployees} isDirectoryLoading={isDirectoryLoading}/>, totalEmployees)} />

          <Route path="/not-found" element={withLayout(<NotFoundPage />, totalEmployees)} />

          <Route path="*" element={withLayout(<NotFoundPage />, totalEmployees)} />
          
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
