import React from 'react';
import '../styles/addEmployee.css'
import { Link , useNavigate} from 'react-router-dom';

const initialEmployee = {
  id: "",
  name: "",
  initials: "",
  email: "",
  department: "",
  salary: "",
  status: "",
};

export default function AddEmployeePage({employees, setEmployees}) {

    const navigate = useNavigate();

    const [employee, setEmployee] = React.useState(initialEmployee);
    
    const yearlySalary = employee.salary * 12;
    const lpa = Number((yearlySalary / 100000).toFixed(2));
  


    const handleChange = (e) => {
        const {name, value} = e.target;

        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]:  name === "salary" ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const initials = employee.name
            .trim()
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");


        const newEmployee = {
            ...employee,
            id: Date.now().toString(),
            initials,
            yearlySalary,
            lpa,
        };
          const updatedEmployees = [...employees, newEmployee];
            setEmployees(updatedEmployees);

            localStorage.setItem(
            "employees",
            JSON.stringify(updatedEmployees)
            );

        
        console.log('New Employee:', newEmployee);
          alert("Employee added successfully!");

        setEmployee(initialEmployee);
        navigate("/");

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
              placeholder="Enter employee monthly salary"
              value={employee.salary}
              onChange={handleChange}
              min="0"
              required
            />
            {employee.salary > 0 && (
             <small className="salary-preview">
                Annual Salary: ₹{yearlySalary.toLocaleString()} ({lpa} LPA)
                </small>
            )}
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


          <div className="form-group full-width">
            <button type="submit" className="primary-button">
              Add Employee
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
