import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`
const dashboardNavClass = ({ isActive }) => `nav-link dashboard-nav-link${isActive ? ' active' : ''}`


export default function Header({ totalEmployees }) {
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
      </div>
    </header>
  )
}
