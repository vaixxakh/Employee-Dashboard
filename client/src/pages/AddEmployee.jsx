import React from 'react';

import '../styles/addEmployee.css'

import { Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateEmployee } from '../utils/employeeValidation';
import { useEmployeeData } from '../context/EmployeeContext';
import { formatFileSize, validateProfileImage } from '../utils/profileImage';

const initialEmployee = {
  id: "",
  name: "",
  initials: "",
  email: "",
  department: "",
  salary: "",
  status: "",
  phone: "",
  location: "",
    startDate: "",
};


export default function AddEmployeePage() {
    const { employees = [], addEmployee, uploadProfileImage } = useEmployeeData() || {}

    const navigate = useNavigate();

    const [employee, setEmployee] = React.useState(initialEmployee);
    const [ isSubmitting, setIsSubmitting ] = React.useState(false);
    const isSubmittingRef = React.useRef(false);
    const [isUploadingProfileImage, setIsUploadingProfileImage] = React.useState(false);
    const isUploadingRef = React.useRef(false);
    const [selectedProfileImage, setSelectedProfileImage] = React.useState(null);
    const [profileImagePreview, setProfileImagePreview] = React.useState("");
    const [profileImageError, setProfileImageError] = React.useState("");
    const fileInputRef = React.useRef(null);


    const handleChange = (e) => {
        const {name, value} = e.target;

        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]:  name === "salary" ? Number(value) : value
        }));
    };

    const clearProfileImageSelection = () => {
        if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
        }

        setSelectedProfileImage(null);
        setProfileImagePreview("");
        setProfileImageError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (!file) {
            return;
        }

        const result = validateProfileImage(file);

        if (!result.valid) {
            setProfileImageError(result.message);
            toast.error(result.message);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setProfileImageError("");

        if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
        }

        setSelectedProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
    };

    React.useEffect(() => {
        return () => {
            if (profileImagePreview) {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImagePreview]);


    const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmittingRef.current) {
    return;
  }

  const error = validateEmployee(employee, employees);

  if (error) {
    toast.error(error);
    return;
  }


  isSubmittingRef.current = true;
  setIsSubmitting(true);

  try {
    const createdEmployee = await addEmployee({
    name: employee.name.trim(),
    email: employee.email.trim(),
    department: employee.department,
    salary: employee.salary,
    status: employee.status,
    phone: employee.phone,
    location: employee.location,
    startDate: employee.startDate,
    })

    const createdEmployeeId = createdEmployee?.id || createdEmployee?._id;

    if (selectedProfileImage && createdEmployeeId && !isUploadingRef.current) {
      isUploadingRef.current = true;
      setIsUploadingProfileImage(true);

      try {
        await uploadProfileImage(createdEmployeeId, selectedProfileImage);
        toast.success("Employee added successfully!");
      } catch {
        toast.error("Employee added, but profile image upload failed.");
      } finally {
        isUploadingRef.current = false;
        setIsUploadingProfileImage(false);
      }
    } else {
      toast.success("Employee added successfully!");
    }

    setEmployee(initialEmployee);
    clearProfileImageSelection();
    navigate("/employees");
  } catch {
    toast.error("Unable to add employee. Please try again.");
  } finally {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  }
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
            <label htmlFor="phone">Phone</label>

            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={employee.phone}
              onChange={handleChange}
              required
            />
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

        <div className="form-group full-width profile-image-field">
          <label>Profile Image</label>
          <p className="profile-image-hint">Allowed formats: JPG, PNG, WEBP</p>

          <div className="profile-image-preview">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile image preview" />
            ) : (
              <div className="profile-image-placeholder">No image selected</div>
            )}
          </div>

          {selectedProfileImage && (
            <div className="profile-image-meta">
              <span className="profile-image-name">{selectedProfileImage.name}</span>
              <span className="profile-image-size">{formatFileSize(selectedProfileImage.size)}</span>
            </div>
          )}

          <div className="profile-image-actions">
            <input
              ref={fileInputRef}
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfileImageChange}
            />

            {selectedProfileImage && (
              <button
                type="button"
                className="secondary-button"
                onClick={clearProfileImageSelection}
              >
                Remove
              </button>
            )}
          </div>

          {profileImageError && (
            <p className="profile-image-error">{profileImageError}</p>
          )}
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
            disabled={isSubmitting || isUploadingProfileImage}
            aria-busy={isUploadingProfileImage}
        >
            {isUploadingProfileImage ? 'Uploading...' : isSubmitting ? 'Adding...' : 'Add Employee'}
        </button>
        </div>
        </form>
      </section>
    </>
  )
}
