import React from 'react';

import PageLoader from './PageLoader'
import StatusBadge from './StatusBadge'

import { Link, Navigate, useNavigate , useParams} from 'react-router-dom'
import { toast } from 'react-toastify'
import { formatSalary } from '../utils/formatSalary'
import { convertToDateInputFormat } from '../utils/formatDate'

import ConfirmModal from "./ConfirmModal";


export default function EmployeeDetailsPage({ employees, handleDeleteEmployee,   isDirectoryLoading,
 }) {
  const { employeeId } = useParams()
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

      if (isDirectoryLoading) {
    return <PageLoader label="Loading employee details" />
  }

const employee = employees.find(
  (employee) => String(employee.id) === employeeId
)
  if (!employee) return <Navigate to="/employees" replace />

  const handleDelete = async () => {

  if (isDeleting) {
    return
  }
    setIsDeleting(true);

    try {
      const deleted = await handleDeleteEmployee(employee.id)
      
      if (!deleted) {
        toast.error('Employee not found.')
        return
      }

      toast.success('Employee deleted successfully!')    
         setIsDeleteModalOpen(false)

        navigate('/employees')
    } catch {
      toast.error(
        "Unable to delete employee. Please try again."
      );
    } finally{
      setIsDeleting(false)
    }


}

  return (
    <>
      <Link className="back-link" to="/employees">&larr; Back to employees</Link>
      <section className="profile panel">


        <div className="avatar large">{employee.initials}</div>
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1>{employee.name}</h1>
          <p>{employee.department}</p>
          <StatusBadge status={employee.status} />
        </div>
          <button className="edit-emp" onClick={() => 
            navigate(`/employees/${employee.id}/edit`)}
            >Edit Employee</button>

          
            <button
            className="delete-emp"
              disabled={isDeleting}
            onClick={() => setIsDeleteModalOpen(true)}
            >
            {isDeleting ? "Deleting..." : "Delete Employee"}
          </button>
      </section>
      <ConfirmModal
              open={isDeleteModalOpen}
              title="Delete Employee"
              message="Are you sure you want to delete this employee?"
              confirmLabel="Delete Employee"
              cancelLabel="Cancel"
              isConfirming={isDeleting}
              onConfirm={handleDelete}
              onCancel={() => {
                if (!isDeleting) {
                  setIsDeleteModalOpen(false);
                }
              }}
            />
      <section className="details panel">
        <div><span>Email</span><strong>{employee.email}</strong></div>
        <div><span>Salary</span><strong>{formatSalary(employee.salary)}</strong></div>
        <div><span>Location</span><strong>{employee.location}</strong></div>
        <div><span>Start date</span><strong>{convertToDateInputFormat(employee.startDate)}</strong></div>
      </section>
    </>
  )
}
