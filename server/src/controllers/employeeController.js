const fs = require("fs");
const path = require("path");

const Employee = require("../models/Employee");
const { AppError } = require("../middleware/AppError");

const EMPLOYEE_UPLOAD_DIRECTORY = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "employees"
);

function resolveSafeFilename(storedPath) {
  const storagePrefix = "/uploads/employees/";
  let filename = storedPath;

  if (typeof storedPath === "string" && storedPath.startsWith(storagePrefix)) {
    filename = storedPath.slice(storagePrefix.length);
  }

  const invalid =
    typeof storedPath !== "string" ||
    !storedPath.startsWith(storagePrefix) ||
    !filename ||
    filename === "." ||
    filename === ".." ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\");

  if (invalid) {
    return null;
  }

  return path.join(EMPLOYEE_UPLOAD_DIRECTORY, filename);
}

const SORTABLE_FIELDS = new Set([
  "name",
  "email",
  "department",
  "salary",
  "status",
  "location",
  "startDate",
  "createdAt",
  "updatedAt",
]);

async function listEmployees(req, res, next ) {
  const { status, department, page: rawPage, limit: rawLimit, sort: rawSort } = req.query;

  const page = rawPage !== undefined ? Number(rawPage) : 1;
  const limit = rawLimit !== undefined ? Number(rawLimit) : 10;

  if (rawPage !== undefined && (!Number.isInteger(page) || page < 1)) {
    throw new AppError(
      "page must be an integer greater than 0",
      400,
      "INVALID_EMPLOYEE_DATA"
    );
  }

  if (rawLimit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    throw new AppError(
      "limit must be an integer between 1 and 100",
      400,
      "INVALID_EMPLOYEE_DATA"
    );
  }

  const filter = {};

  if(status) {
    filter.status = status;
  }

  if(department) {
    filter.department = department;
  }

  const sort = {};

  if (rawSort !== undefined && rawSort !== "") {
    const sortedField = rawSort.startsWith("-") ? rawSort.slice(1) : rawSort;
    const sortedDirection = rawSort.startsWith("-") ? -1 : 1;

    if (!SORTABLE_FIELDS.has(sortedField)) {
      throw new AppError(
        "sort must reference a valid field",
        400,
        "INVALID_EMPLOYEE_DATA"
      );
    }

    sort[sortedField] = sortedDirection;
  }

  const totalEmployees = await Employee.countDocuments(filter);
  const totalPages = Math.ceil(totalEmployees / limit);
  const employees = await Employee.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
      pagination: {
        page,
        limit,
        totalEmployees,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
}

async function getEmployee(req, res, next) {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  return res.status(200).json({
    success: true,
    message: "Employee fetched successfully",
    data: employee,
  });
}



async function createEmployee(req, res, next) {
  const body = req.body || {};

     const existingEmployee = await Employee.findOne({
    email: body.email,
  });

  if (existingEmployee) {
    throw new AppError(
      "Duplicate value for email. email already exists.",
      409,
      "EMPLOYEE_ALREADY_EXISTS"
    );
  }

  const employee = new Employee({
    name: body.name,
    email: body.email,
    department: body.department,
    salary: body.salary,
    status: body.status,
    phone: body.phone,
    location: body.location,
    startDate: body.startDate,
  });


  const savedEmployee = await employee.save();

  return res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: savedEmployee,
  });
}


async function editEmployee(req, res, next) {
  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      salary: req.body.salary,
      status: req.body.status,
      phone: req.body.phone,
      location: req.body.location,
      startDate: req.body.startDate,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedEmployee) {
    throw new AppError(
      "Employee not found",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  return res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: updatedEmployee,
  });
}



async function removeEmployee(req, res, next) {
  const deletedEmployee = await Employee.findByIdAndDelete(
    req.params.id
  );

  if (!deletedEmployee) {
    throw new AppError(
      "Employee not found",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  return res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
    data: null,
  });
}

async function uploadEmployeeProfileImage(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      throw new AppError(
        "Employee not found",
        404,
        "EMPLOYEE_NOT_FOUND"
      );
    }

    if (!req.file) {
      throw new AppError(
        "Profile image is required.",
        400,
        "PROFILE_IMAGE_REQUIRED"
      );
    }

    const oldSafePath = resolveSafeFilename(employee.profileImage);

    employee.profileImage = `/uploads/employees/${req.file.filename}`;

    const updatedEmployee = await employee.save();

    if (oldSafePath) {
      const newSafePath = resolveSafeFilename(updatedEmployee.profileImage);
      const oldPath = path.resolve(oldSafePath);
      const newPath = path.resolve(newSafePath);

      if (oldPath !== newPath) {
        fs.unlink(oldSafePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Error:", err.message);
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    if (req.file) {
      const uploaded = resolveSafeFilename(`/uploads/employees/${req.file.filename}`);
      fs.unlink(uploaded, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error:", err.message);
        }
      });
    }

    next(error);
  }
}

async function deleteEmployeeProfileImage(req, res, next) {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  const storedPath = employee.profileImage || "";

  if (!storedPath) {
    return res.status(200).json({
      success: true,
      message: "No profile image to delete.",
      data: employee,
    });
  }

  const resolvedPath = resolveSafeFilename(storedPath);

  if (!resolvedPath) {
    throw new AppError(
      "Invalid profile image path",
      400,
      "INVALID_PROFILE_IMAGE_PATH"
    );
  }

  employee.profileImage = "";

  const updatePromise = employee.save();

  fs.unlink(resolvedPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error:", err.message);
    }
  });

  const updatedEmployee = await updatePromise;

  return res.status(200).json({
    success: true,
    message: "Profile image deleted successfully",
    data: updatedEmployee,
  });
}

async function getStatistics(req, res, next) {
  const result = await Employee.aggregate([
    {
      $group: {
        _id: null,
        totalEmployees: { $sum: 1 },
        activeEmployees: {
          $sum: {
            $cond: [{ $eq: ["$status", "Active"] }, 1, 0],
          },
        },
        inactiveEmployees: {
          $sum: {
            $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0],
          },
        },
        totalSalary: { $sum: "$salary" },
        averageSalary: { $avg: "$salary" },
        highestSalary: { $max: "$salary" },
        lowestSalary: { $min: "$salary" },
      },
    },
  ]);

  if (result.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        totalSalary: 0,
        averageSalary: 0,
        highestSalary: 0,
        lowestSalary: 0,
      },
    });
  }

  const stats = result[0];

  return res.status(200).json({
    success: true,
    message: "Statistics fetched successfully",
    data: {
      totalEmployees: stats.totalEmployees,
      activeEmployees: stats.activeEmployees,
      inactiveEmployees: stats.inactiveEmployees,
      totalSalary: stats.totalSalary,
      averageSalary: stats.averageSalary,
      highestSalary: stats.highestSalary,
      lowestSalary: stats.lowestSalary,
    },
  });
}

async function searchEmployeeList(req, res, next) {
  const {
    name,
    email,
    department,
    status,
    query,
    page: rawPage,
    limit: rawLimit,
  } = req.query;

  const page = rawPage !== undefined ? Number(rawPage) : 1;
  const limit = rawLimit !== undefined ? Number(rawLimit) : 10;

  if (rawPage !== undefined && (!Number.isInteger(page) || page < 1)) {
    throw new AppError(
      "page must be an integer greater than 0",
      400,
      "INVALID_EMPLOYEE_DATA"
    );
  }

  if (rawLimit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    throw new AppError(
      "limit must be an integer between 1 and 100",
      400,
      "INVALID_EMPLOYEE_DATA"
    );
  }

  const filter = {};

  if (name) {
    filter.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (email) {
    filter.email = {
      $regex: email,
      $options: "i",
    };
  }

  if (department) {
    filter.department = {
      $regex: department,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  if (query) {
    filter.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        email: {
          $regex: query,
          $options: "i",
        },
      },
      {
        department: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  const totalEmployees = await Employee.countDocuments(filter);
  const totalPages = Math.ceil(totalEmployees / limit);
  const employees = await Employee.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json({
    success: true,
    message: "Employees fetched successfully",
    data: employees,
    pagination: {
      page,
      limit,
      totalEmployees,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}


module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  uploadEmployeeProfileImage,
  deleteEmployeeProfileImage,
  getStatistics,
  searchEmployeeList,
};