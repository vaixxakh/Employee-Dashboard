import React from 'react';
import '../styles/addEmployee.css'
import { Link , useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';

const initialEmployee = {
  id: "",
  name: "",
  initials: "",
  email: "",
  department: "",
  salary: "",
  status: "",
  location: "",
    startDate: "",
};

export default function AddEmployeePage({employees, setEmployees}) {

    const navigate = useNavigate();

    const [employee, setEmployee] = React.useState(initialEmployee);
    

    const handleChange = (e) => {
        const {name, value} = e.target;

        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]:  name === "salary" ? Number(value) : value
        }));
    };

            const validateEmployee = () => {
        if (employee.name.trim().length < 3) {
            return "Employee name must contain at least 3 characters.";
        }

        const emailExists = employees.some(
            (emp) =>
            emp.email.toLowerCase() === employee.email.toLowerCase()
        );

        if (emailExists) {
            return "Email already exists.";
        }

        if (employee.salary <= 0) {
            return "Salary must be greater than 0.";
        }
        if (employee.location.trim().length < 2) {
        return "Location is required.";
        };
        if (!employee.startDate) {
        return "Please select a start date.";
        }

        return null;
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        
       const error = validateEmployee();

        if (error) {
           toast.error(error);
            return;
        }

        const initials = employee.name
            .trim()
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");


        const newEmployee = {
            ...employee,
            id: crypto.randomUUID(),
            initials,
        };
          const updatedEmployees = [newEmployee, ...employees ];
            setEmployees(updatedEmployees);

            localStorage.setItem(
            "employees",
            JSON.stringify(updatedEmployees)
            );

        
        console.log('New Employee:', newEmployee);
        setTimeout(() => {
            toast.success("Employee added successfully!");
            setEmployee(initialEmployee);
            navigate("/employees");
        }, 500);

    };

  return (
    <>
       <div className="page-heading">
      <Link className="back-link" to="/employees">&larr; Back to employees</Link>
        <h1>Add Employee</h1>
        <p>Fill in the employee details below.</p>
      </div>

      <section className="panel">

       

        <form className="add-employee-form" onSubmit={handleSubmit}>
            

          <div className="form-group">
            <label htmlFor="name">Employee Name</label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter employee name"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter employee email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>

            <select
              id="department"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
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
              placeholder="Enter employee  salary"
              value={employee.salary}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={employee.status}
              onChange={handleChange}
              required
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
            placeholder="Enter work location"
            value={employee.location}
            onChange={handleChange}
            required
        />
        </div>
        <div className="form-group">
        <label htmlFor="startDate">Start Date</label>

        <input
            type="date"
            id="startDate"
            name="startDate"
            value={employee.startDate}
            onChange={handleChange}
            required
        />
        </div>

        <div className="form-actions">
        <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/employees")}
        >
            Cancel
        </button>

        <button
            type="submit"
            className="primary-button"
        >
            Add Employee
        </button>
        </div>
        </form>
      </section>
    </>
  )
}
