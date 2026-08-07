import { Link, Navigate, useParams } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function EmployeeDetailsPage({ employees }) {
  const { employeeId } = useParams()
  const employee = employees.find(({ id }) => id === employeeId)

  if (!employee) return <Navigate to="/employees" replace />

  return (
    <>
      <Link className="back-link" to="/employees">&larr; Back to employees</Link>
      <section className="profile panel">
        <div className="avatar large">{employee.initials}</div>
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1>{employee.name}</h1>
          <p>{employee.role} &middot; {employee.department}</p>
          <StatusBadge status={employee.status} />
        </div>
      </section>
      <section className="details panel">
        <div><span>Email</span><strong>{employee.email}</strong></div>
        <div><span>Salary</span><strong>{employee.salary}</strong></div>
        <div><span>Location</span><strong>{employee.location}</strong></div>
        <div><span>Start date</span><strong>{employee.startDate}</strong></div>
      </section>
    </>
  )
}
