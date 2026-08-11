import { Link, Navigate, useNavigate , useParams} from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { toast } from 'react-toastify'

export default function EmployeeDetailsPage({ employees, handleDeleteEmployee }) {
  const { employeeId } = useParams()
  const navigate = useNavigate();

  const employee = employees.find(({ id }) => id === employeeId)

  if (!employee) return <Navigate to="/employees" replace />

  const handleDelete = () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${employee.name}?`
  )

  if (!confirmed) {
    return
  }

  const deleted = handleDeleteEmployee(employee.id)

  if (!deleted) {
    toast.error('Employee not found.')
    return
  }

  toast.success('Employee deleted successfully!')

  navigate('/employees')
}

  return (
    <>
      <Link className="back-link" to="/employees">&larr; Back to employees</Link>
      <section className="profile panel">


        <div className="avatar large">{employee.initials}</div>
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1>{employee.name}</h1>
          <p>{employee.role}  {employee.department}</p>
          <StatusBadge status={employee.status} />
        </div>
          <button className="edit-emp" onClick={() => 
            navigate(`/employees/${employee.id}/edit`)}
            >Edit Employee</button>

            <button
            className="delete-emp"
            onClick={() => handleDelete()}
            >
            Delete Employee
          </button>
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
