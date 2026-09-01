import React from 'react';

import PageLoader from './PageLoader'
import StatusBadge from './StatusBadge'

import { Link, useNavigate , useParams} from 'react-router-dom'
import { toast } from 'react-toastify'
import { formatSalary } from '../utils/formatSalary'
import { convertToDateInputFormat } from '../utils/formatDate'
import { getProfileImageUrl } from '../utils/profileImage'

import ConfirmModal from "./ConfirmModal";
import { useAuth } from '../hooks/useAuth'
import { useEmployeeData } from '../context/EmployeeContext'
import { getEmployeeById } from '../services/userService'
import { mapApiEmployeeToFrontend } from '../mappers/userMapper'


export default function EmployeeDetailsPage() {
  const { handleDeleteEmployee } = useEmployeeData() || {}
  const { employeeId } = useParams()
  const navigate = useNavigate();
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [employee, setEmployee] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);
  const [imageError, setImageError] = React.useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadEmployee = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const apiEmployee = await getEmployeeById(employeeId);
      setEmployee(mapApiEmployeeToFrontend(apiEmployee));
      setImageError(false);
    } catch (error) {
      setEmployee(null);
      setLoadError(error);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  React.useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  if (isLoading) {
    return <PageLoader label="Loading employee details" />
  }

  if (loadError || !employee) {
    const errorMessage = String(loadError?.message || '').toLowerCase();
    const isNotFound =
      errorMessage.includes('not found') || errorMessage.includes('invalid id');

    if (isNotFound) {
      return (
        <section className="empty">
          <p className="eyebrow">404</p>
          <h1>Employee not found</h1>
          <Link className="primary-button" to="/employees">Back to employees</Link>
        </section>
      )
    }

    return (
      <section className="panel-error">
        <p>Unable to load employee details. Please try again.</p>
        <button className="primary-button" onClick={loadEmployee}>Try Again</button>
      </section>
    )
  }

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

  const profileImageUrl = getProfileImageUrl(employee.profileImage)

  return (
    <>
      <Link className="back-link" to="/employees">&larr; Back to employees</Link>
      <section className="profile panel">


        <div className="avatar large">
          {profileImageUrl && !imageError ? (
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
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1>{employee.name}</h1>
          <p>{employee.department}</p>
          <StatusBadge status={employee.status} />
        </div>
          {isAdmin && (
            <button className="edit-emp" onClick={() => 
              navigate(`/employees/${employee.id}/edit`)}
              >Edit Employee</button>
          )}

          
            {isAdmin && (
              <button
              className="delete-emp"
                disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(true)}
              >
              {isDeleting ? "Deleting..." : "Delete Employee"}
            </button>
            )}
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
        <div><span>Phone</span><strong>{employee.phone}</strong></div>
        <div><span>Salary</span><strong>{formatSalary(employee.salary)}</strong></div>
        <div><span>Location</span><strong>{employee.location}</strong></div>
        <div><span>Start date</span><strong>{convertToDateInputFormat(employee.startDate)}</strong></div>
      </section>
    </>
  )
}