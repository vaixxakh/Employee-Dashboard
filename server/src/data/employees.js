  const employees = [
  {
    id: 1,
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    department: "Frontend",
    status: "Active",
    salary: 42000,
    startDate: "2022-06-10",
    location: "Kochi",
    initials: "AN",
  },
  {
    id: 2,
    name: "Meera Menon",
    email: "meera.menon@example.com",
    department: "UI/UX",
    status: "Active",
    salary: 48000,
    startDate: "2021-09-15",
    location: "Kozhikode",
    initials: "MM",
  },
  {
    id: 3,
    name: "Vishnu Krishnan",
    email: "vishnu.krishnan@example.com",
    department: "Backend",
    status: "Active",
    salary: 55000,
    startDate: "2020-03-20",
    location: "Thiruvananthapuram",
    initials: "VK",
  },
  {
    id: 4,
    name: "Anjali Suresh",
    email: "anjali.suresh@example.com",
    department: "HR",
    status: "Active",
    salary: 38000,
    startDate: "2023-01-12",
    location: "Thrissur",
    initials: "AS",
  },
  {
    id: 5,
    name: "Rahul Raj",
    email: "rahul.raj@example.com",
    department: "Full Stack",
    status: "Active",
    salary: 62000,
    startDate: "2019-11-05",
    location: "Kollam",
    initials: "RR",
  },
  {
    id: 6,
    name: "Devika Prasad",
    email: "devika.prasad@example.com",
    department: "Testing",
    status: "Inactive",
    salary: 35000,
    startDate: "2022-08-18",
    location: "Kannur",
    initials: "DP",
  },
  {
    id: 7,
    name: "Nikhil Thomas",
    email: "nikhil.thomas@example.com",
    department: "QA",
    status: "Active",
    salary: 45000,
    startDate: "2021-04-22",
    location: "Kottayam",
    initials: "NT",
  },
  {
    id: 8,
    name: "Athira Mohan",
    email: "athira.mohan@example.com",
    department: "Frontend",
    status: "Active",
    salary: 51000,
    startDate: "2020-12-01",
    location: "Alappuzha",
    initials: "AM",
  },
  {
    id: 9,
    name: "Sandeep Kumar",
    email: "sandeep.kumar@example.com",
    department: "Backend",
    status: "Inactive",
    salary: 47000,
    startDate: "2023-05-09",
    location: "Palakkad",
    initials: "SK",
  },
  {
    id: 10,
    name: "Fathima Shirin",
    email: "fathima.shirin@example.com",
    department: "UI/UX",
    status: "Active",
    salary: 44000,
    startDate: "2022-02-14",
    location: "Malappuram",
    initials: "FS",
  },
];

let nextId = employees.length + 1;

function getAllEmployees() {
  return employees;
}

function getEmployeeById(id) {
  return employees.find((emp) => emp.id === id) || null;
}

function addEmployee(employeeData) {
  const id = nextId++;
  const name = employeeData.name || "";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const employee = {
    id,
    name,
    email: employeeData.email || "",
    department: employeeData.department || "",
    status: employeeData.status || "Active",
    salary: employeeData.salary || 0,
    startDate: employeeData.startDate || "",
    location: employeeData.location || "",
    initials,
  };

  employees.push(employee);
  return employee;
}

function updateEmployee(id, employeeData) {
  const index = employees.findIndex((emp) => emp.id === id);
  if (index === -1) return null;

  const name = employeeData.name;
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  employees[index] = {
    ...employees[index],
    name,
    email: employeeData.email,
    department: employeeData.department,
    salary: employeeData.salary,
    status: employeeData.status,
    initials,
  };

  return employees[index];
}

function deleteEmployee(id) {
  const index = employees.findIndex((emp) => emp.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  return true;
}

function searchEmployees({ name, email, department, status, query }) {
  const normalizedName = name?.trim().toLowerCase();
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedDepartment = department?.trim().toLowerCase();
  const normalizedStatus = status?.trim().toLowerCase();
  const normalizedQuery = query?.trim().toLowerCase();

  return employees.filter((employee) => {
    const queryMatches =
      !normalizedQuery ||
      employee.name.toLowerCase().includes(normalizedQuery) ||
      employee.email.toLowerCase().includes(normalizedQuery) ||
      employee.department.toLowerCase().includes(normalizedQuery);

    const nameMatches =
      !normalizedName ||
      employee.name.toLowerCase().includes(normalizedName);

    const emailMatches =
      !normalizedEmail ||
      employee.email.toLowerCase().includes(normalizedEmail);

    const departmentMatches =
      !normalizedDepartment ||
      employee.department.toLowerCase().includes(normalizedDepartment);

    const statusMatches =
      !normalizedStatus ||
      employee.status.toLowerCase() === normalizedStatus;

    return queryMatches && nameMatches && emailMatches && departmentMatches && statusMatches;
  });
}

function filterEmployees({ status, department } = {}) {
  let result = employees;

  if (status) {
    const normalizedStatus = status.trim().toLowerCase();
    result = result.filter(
      (emp) => emp.status.toLowerCase() === normalizedStatus
    );
  }

  if (department) {
    const normalizedDepartment = department.trim().toLowerCase();
    result = result.filter(
      (emp) => emp.department.toLowerCase() === normalizedDepartment
    );
  }

  return result;
}

employees.getAllEmployees = getAllEmployees;
employees.getEmployeeById = getEmployeeById;
employees.addEmployee = addEmployee;
employees.updateEmployee = updateEmployee;
employees.deleteEmployee = deleteEmployee;
employees.searchEmployees = searchEmployees;
employees.filterEmployees = filterEmployees;

module.exports = employees;
