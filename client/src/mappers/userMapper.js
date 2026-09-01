export const mapApiEmployeeToFrontend = (employee) => {
  return {
    id: employee.id || employee._id,
    name: employee.name,
    email: employee.email,
    department: employee.department || "",
    status: employee.status || "Active",
    salary: employee.salary || 0,
    phone: employee.phone || "",
    startDate: employee.startDate || "",
    location: employee.location || "",
    profileImage: employee.profileImage || "",
    initials:
      employee.initials ||
      employee.name
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
  };
};
