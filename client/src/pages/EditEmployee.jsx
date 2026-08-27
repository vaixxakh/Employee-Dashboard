import React from 'react'

import { Link, Navigate,  useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertToDateInputFormat } from '../utils/formatDate';
import { validateEmployee } from '../utils/employeeValidation';
import { useEmployeeData } from '../context/EmployeeContext';



export default function EditEmployee() {
  const { employees = [], updateEmployee, isDirectoryLoading } = useEmployeeData() || {}

  const { employeeId } = useParams()
  const navigate = useNavigate()
  
  const [employee, setEmployee] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittingRef = React.useRef(false);

  const employeeToEdit = employees.find(
    (employee) => String(employee.id) === String(employeeId)
  )
  React.useEffect(() => {
    if(employeeToEdit) {
        const employeeWithFormattedDate = {
          ...employeeToEdit,
          startDate: convertToDateInputFormat(employeeToEdit.startDate)
        };
        setEmployee(employeeWithFormattedDate);
    }
  }, [employeeToEdit]);


 if (isDirectoryLoading) {
  return <p>Loading employee...</p>
};
if (!employeeToEdit) {
  return <Navigate to="/employees" replace />
}
if (!employee) {
  return <p>Loading employee...</p>
}



  const handleChange = (e) => {
    const { name, value } = e.target

    setEmployee((previousEmployee) => ({
      ...previousEmployee,
      [name]: name === 'salary' ? Number(value) : value,
    }))
    
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmittingRef.current) {
    return;
  }

    const error = validateEmployee(employee, employees, employeeId);

    if(error){
        toast.error(error);
        return; 
    }


  isSubmittingRef.current = true;
  setIsSubmitting(true);

  try {
     await updateEmployee(employeeId, {
    name: employee.name.trim(),
    email: employee.email.trim(),

    department: employee.department,
    salary: employee.salary,
    status: employee.status,
    phone: employee.phone,
    location: employee.location,
    startDate: employee.startDate,
  })

    toast.success('Employee updated successfully!');

    navigate('/employees');
  } catch {
    toast.error('Unable to update employee. Please try again.');
  } finally {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  }
}

  return (
    <>
    
      <Link
        className="back-link"
        to={`/employees/${employeeId}`}
      >
        &larr; Back to employee
      </Link>

      <section className="page-heading">
        <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
        <h1>Edit Employee</h1>
        <p>Update the employee details below.</p>
      </section>

      <section className="panel">
        <form className="add-employee-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">Employee Name</label>

            <input
              type="text"
              id="name"
              name="name"
              required
              value={employee.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              required
              value={employee.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>

            <select
              id="department"
              name="department"
              required
              value={employee.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Testing">Testing</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="HR">HR</option>

            </select>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>

            <input
              type="number"
              id="salary"
              name="salary"
              required
              value={employee.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              required
              value={employee.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              

            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>

            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={employee.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>

            <input
              type="text"
              id="location"
              name="location"
              required
              value={employee.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>

            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={employee.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(`/employees/${employeeId}`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Employee'}
            </button>
          </div>

        </form>
      </section>
    </>
  )
}
