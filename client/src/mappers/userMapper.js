export const mapApiEmployeeToFrontend = (employee) => {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department || "",
    status: employee.status || "Active",
    salary: employee.salary || 0,
    startDate: employee.startDate || "",
    location: employee.location || "",
    initials:
      employee.initials ||
      employee.name
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
  };
};
