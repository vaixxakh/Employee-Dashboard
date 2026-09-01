import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatSalary } from '../utils/formatSalary'
import { getProfileImageUrl } from '../utils/profileImage'


export default function EmployeeCard({ employee }) {
  const [imageError, setImageError] = React.useState(false)

  const profileImageUrl = getProfileImageUrl(employee.profileImage)
  const showImage = profileImageUrl && !imageError

  return (
    <Link className="employee-card" to={`/employees/${employee.id}`} aria-label={`View ${employee.name}'s profile`}>
      <div className="avatar" aria-hidden="true">
        {showImage ? (
          <img
            src={profileImageUrl}
            alt={`${employee.name} profile`}
            onError={() => setImageError(true)}
          />
        ) : (
          employee.initials
        )}
      </div>
      <div>
        <h3>{employee.name}</h3>
        <span className="department">{employee.department}</span>
        <p className="employee-email">{employee.email}</p>
        <p className="employee-salary">{formatSalary(employee.salary)} / month</p>
        <StatusBadge status={employee.status} />
      </div>
    </Link>
  )
}
