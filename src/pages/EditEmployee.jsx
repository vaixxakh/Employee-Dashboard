import React from 'react'
import { Link, Navigate,  useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertToDateInputFormat } from '../utils/formatDate';
import { validateEmployee } from '../utils/employeeValidation';
import { getInitials } from '../utils/getInitials';



export default function EditEmployee({ employees, setEmployees, isDirectoryLoading }) {

  const { employeeId } = useParams()
  const navigate = useNavigate()
  
  const [employee, setEmployee] = React.useState(null);

  const employeeToEdit = employees.find(
    (employee) => String(employee.id) === employeeId
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
  

const handleSubmit = (e) => {
  e.preventDefault();

    const error = validateEmployee(employee, employees, employeeId);

    if(error){
        toast.error(error);
        return; 
    }

        
    const updatedEmployee = {
        ...employee,
        id: employeeToEdit.id,
        initials: getInitials(employee.name),
        name: employee.name.trim(),
        email: employee.email.trim(),

    };
     const updatedEmployees = employees.map(
    (existingEmployee) =>
      String(existingEmployee.id) === employeeId
        ? updatedEmployee
        : existingEmployee
  )

  setEmployees(updatedEmployees)

  toast.success('Employee updated successfully!')

  navigate('/employees')
    
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
              
            >
              Update Employee
            </button>
          </div>

        </form>
      </section>
    </>
  )
}
