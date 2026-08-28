import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { useEmployeeData } from '../context/EmployeeContext'

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`
const dashboardNavClass = ({ isActive }) => `nav-link dashboard-nav-link${isActive ? ' active' : ''}`


export default function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const employeeData = useEmployeeData()
  const totalEmployees = employeeData?.pagination?.totalEmployees ?? 0

  const handleLogout = () => {
    logout()

    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Employee Management Dashboard">
        <span className="brand-mark" aria-hidden="true">ED</span>
        <span>Employee Management Dashboard</span>
      </Link>
      <div className="header-actions">
        <nav aria-label="Main navigation">
        <NavLink className={dashboardNavClass} to="/" end>Dashboard</NavLink>
          <NavLink className={navClass} to="/employees">Employees</NavLink>
        </nav>
        <span className="employee-count"><strong>{totalEmployees}</strong> Total Employees</span>
        {isAuthenticated && (
          <>
            <span className="employee-count user-chip">
              <strong>{user?.name}</strong>
            </span>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
