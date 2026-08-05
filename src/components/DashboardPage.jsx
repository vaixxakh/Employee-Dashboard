import { Link } from 'react-router-dom'
import EmployeeList from './EmployeeList'
import MetricCard from './MetricCard'
import PageLoader from './PageLoader'
import { formatSalary } from '../utils/formatSalary'

function getDashboardStats(employees) {
  const activeEmployees = employees.filter(({ status }) => status === 'Active').length
  const inactiveEmployees = employees.filter(({ status }) => status === 'Inactive').length
  const totalSalary = employees.reduce((total, { salary }) => total + salary, 0)

  return {
    activeEmployees,
    inactiveEmployees,
    averageSalary: Math.round(totalSalary / employees.length),
  }
}

export default function DashboardPage({ employees, isLoading }) {
  const { activeEmployees, inactiveEmployees, averageSalary } = getDashboardStats(employees)

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">WORKSPACE OVERVIEW</p>
          <h1>Good morning, team.</h1>
          <p>Here is a snapshot of your people operations today.</p>
        </div>
        <Link className="primary-button" to="/employees">View employees</Link>
      </section>

      <section className="metrics" aria-label="Dashboard statistics">
        <MetricCard label="Total employees" value={employees.length} />
        <MetricCard label="Active employees" value={activeEmployees} />
        <MetricCard label="Inactive employees" value={inactiveEmployees} />
        <MetricCard label="Average salary" value={formatSalary(averageSalary)} />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TEAM DIRECTORY</p>
            <h2>Recently added employees</h2>
          </div>
          <Link to="/employees">See all -&gt;</Link>
        </div>
        {isLoading && <PageLoader label="Loading employee overview" />}
        <EmployeeList employees={employees.slice(0, 3)} isLoading={isLoading} />
      </section>
    </>
  )
}
