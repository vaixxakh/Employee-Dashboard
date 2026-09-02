import React from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertToDateInputFormat } from '../utils/formatDate';
import { validateEmployee } from '../utils/employeeValidation';
import { useEmployeeData } from '../context/EmployeeContext';
import { getEmployeeById } from '../services/userService';
import { mapApiEmployeeToFrontend } from '../mappers/userMapper';
import { formatFileSize, getProfileImageUrl, validateProfileImage } from '../utils/profileImage';



export default function EditEmployee() {
  const { employees = [], updateEmployee, uploadProfileImage } = useEmployeeData() || {}

  const { employeeId } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittingRef = React.useRef(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = React.useState(false);
  const isUploadingRef = React.useRef(false);
  const [selectedProfileImage, setSelectedProfileImage] = React.useState(null);
  const [profileImagePreview, setProfileImagePreview] = React.useState("");
  const [profileImageError, setProfileImageError] = React.useState("");
  const fileInputRef = React.useRef(null);

  const loadEmployee = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const apiEmployee = await getEmployeeById(employeeId);
      const mappedEmployee = mapApiEmployeeToFrontend(apiEmployee);

      setEmployee({
        ...mappedEmployee,
        startDate: convertToDateInputFormat(mappedEmployee.startDate),
      });
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

  React.useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);


 if (isLoading) {
  return <p>Loading employee...</p>
};

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
      <p>Unable to load employee. Please try again.</p>
      <button className="primary-button" onClick={loadEmployee}>Try Again</button>
    </section>
  )
}



  const handleChange = (e) => {
    const { name, value } = e.target

    setEmployee((previousEmployee) => ({
      ...previousEmployee,
      [name]: name === 'salary' ? Number(value) : value,
    }))
    
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

    if (selectedProfileImage && !isUploadingRef.current) {
      isUploadingRef.current = true;
      setIsUploadingProfileImage(true);

      try {
        await uploadProfileImage(employeeId, selectedProfileImage);
        toast.success('Employee updated successfully!');
      } catch {
        toast.error('Employee updated, but profile image upload failed.');
      } finally {
        isUploadingRef.current = false;
        setIsUploadingProfileImage(false);
      }
    } else {
      toast.success('Employee updated successfully!');
    }

    clearProfileImageSelection();
    navigate('/employees');
  } catch (error) {
    toast.error(error?.message || 'Unable to update employee. Please try again.');
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

          <div className="form-group full-width profile-image-field">
            <label>Profile Image</label>
            <p className="profile-image-hint">Allowed formats: JPG, PNG, WEBP</p>

            <div className="profile-image-preview">
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile image preview" />
              ) : getProfileImageUrl(employee.profileImage) ? (
                <img src={getProfileImageUrl(employee.profileImage)} alt="Employee profile image" />
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
              onClick={() => navigate(`/employees/${employeeId}`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting || isUploadingProfileImage}
              aria-busy={isUploadingProfileImage}
            >
              {isUploadingProfileImage ? 'Uploading...' : isSubmitting ? 'Updating...' : 'Update Employee'}
            </button>
          </div>

        </form>
      </section>
    </>
  )
}