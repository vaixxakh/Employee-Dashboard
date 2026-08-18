const employees = require("../data/employees");

const {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  filterEmployees,
} = employees;

function listEmployees(req, res) {
  const { status, department } = req.query;

  if (!status && !department) {
    const allEmployees = getAllEmployees();
    return res.json({ success: true, data: allEmployees });
  }

  const filtered = filterEmployees({ status, department });
  return res.json({ success: true, data: filtered });
}

function getEmployee(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid employee ID" });
  }

  const employee = getEmployeeById(id);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  res.json({ success: true, data: employee });
}

function createEmployee(req, res, next) {
  try {
    const body = req.body || {};

    const name = typeof body.name === "string" ? body.name : undefined;
    const email = typeof body.email === "string" ? body.email : undefined;
    const department = typeof body.department === "string" ? body.department : undefined;
    const salary = body.salary;
    const status = typeof body.status === "string" ? body.status : undefined;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Employee name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const allEmployees = getAllEmployees();
    const duplicate = allEmployees.some(
      (emp) => emp.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: "Department is required" });
    }

    const salaryNum = Number(salary);
    if (salary === undefined || salary === null || salary === "" || !isFinite(salaryNum) || salaryNum <= 0) {
      return res.status(400).json({ success: false, message: "Salary must be greater than 0" });
    }

    const validStatuses = ["Active", "Inactive"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Active or Inactive" });
    }

    
    const employee = addEmployee({
      name: name.trim(),
      email: trimmedEmail,
      department: department.trim(),
      status,
      salary: salaryNum,
      startDate: body.startDate || "",
      location: body.location || "",
    });

    return res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

function editEmployee(req, res) {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }

  const employee = getEmployeeById(id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  const {
    name,
    email,
    department,
    salary,
    status,
  } = req.body || {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Employee name is required",
    });
  }

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  const emailExists = getAllEmployees().some(
    (existingEmployee) =>
      existingEmployee.id !== id &&
      existingEmployee.email.trim().toLowerCase() === normalizedEmail
  );

  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  if (
    typeof department !== "string" ||
    !department.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Department is required",
    });
  }

  const numericSalary = Number(salary);

  if (
    salary === undefined ||
    salary === null ||
    salary === "" ||
    (typeof salary !== "number" && typeof salary !== "string") ||
    (typeof salary === "string" && !salary.trim()) ||
    !Number.isFinite(numericSalary) ||
    numericSalary <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Salary must be greater than 0",
    });
  }

  if (!["Active", "Inactive"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be Active or Inactive",
    });
  }

  const updated = updateEmployee(id, {
    name: normalizedName,
    email: normalizedEmail,
    department: department.trim(),
    salary: numericSalary,
    status,
  });

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: updated,
  });
}


function removeEmployee(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid employee ID" });
  }

  const deleted = deleteEmployee(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  res.json({ success: true, message: "Employee deleted successfully" });
};

function searchEmployeeList(req, res) {
  const { name, email, department, status, query } = req.query;

  const results = searchEmployees({
    name,
    email,
    department,
    status,
    query,
  });

  return res.status(200).json({
    success: true,
    data: results,
  });
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  searchEmployeeList,
  
};
