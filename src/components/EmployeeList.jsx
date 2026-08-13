import EmployeeCard from './EmployeeCard'
import ListSkeleton from './ListSkeleton'

export default function EmployeeList(
  { employees, emptyMessage = 'No employees found.', isDirectoryLoading = false }) {
  if (isDirectoryLoading) {
    return <ListSkeleton count={employees.length || 6} />
  }

  if (!employees.length) {
    return <p className="list-empty">{emptyMessage}</p>
  }

  return (
    <div className="employee-grid" role="list" aria-label="Employees">
      {employees.map((employee) => (
        <div key={employee.id} role="listitem">
          <EmployeeCard employee={employee} />
        </div>
      ))}
    </div>
  )
}
