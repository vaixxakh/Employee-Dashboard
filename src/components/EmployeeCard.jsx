import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatSalary } from '../utils/formatSalary'


export default function EmployeeCard({ employee }) {
  return (
    <Link className="employee-card" to={`/employees/${employee.id}`} aria-label={`View ${employee.name}'s profile`}>
      <div className="avatar" aria-hidden="true">{employee.initials}</div>
      <div>
        <h3>{employee.name}</h3>
        <span className="department">{employee.department}</span>
        <p className="employee-email">{employee.email}</p>
        <p className="employee-salary">{formatSalary(employee.salary)} / year</p>
        <StatusBadge status={employee.status} />
      </div>
    </Link>
  )
}
