const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmployee(employee, employees, employeeId = null) {
  const name = employee.name.trim()
  const email = employee.email.trim()
  const department = employee.department.trim()
  const location = employee.location.trim()
  const status = employee.status.trim()

  if (!name) {
    return 'Employee name is required.'
  }

  if (name.length < 3) {
    return 'Employee name must contain at least 3 characters.'
  }

  

  if (email.length < 3) {
    return 'Email must contain at least 3 characters.'
  }

  if (!email) {
    return 'Email is required.'
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address.'
  }

  const emailExists = employees.some(
    (existingEmployee) =>
      String(existingEmployee.id) !== String(employeeId) &&
      existingEmployee.email.trim().toLowerCase() === email.toLowerCase()
  )

  if (emailExists) {
    return 'Email already exists.'
  }

  if (!employee.salary || Number(employee.salary) <= 0) {
    return 'Salary must be greater than 0.'
  }

  if (!department) {
    return 'Department is required.'
  }

  if (!status) {
    return 'Status is required.'
  }

  if (!location) {
    return 'Location is required.'
  }

  if (!employee.startDate) {
    return 'Please select a start date.'
  }

  const phone = (employee.phone || '').trim()
  if (!phone) {
    return 'Phone number is required.'
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return 'Please enter a valid 10-digit phone number.'
  }

  return null
}

export default validateEmployee
