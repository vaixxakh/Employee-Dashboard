const Employee = require("../model/Employee");

async function listEmployees(req, res, next ) {
  try {
    const { status, department } = req.query;

    const filter = {};

    if(status) {
      filter.status = status;
    }

    if(department) {
      filter.department = department;
    }

    const employees = await Employee.find(filter);

      return res.status(200).json({
        success: true,
        data: employees,
      });
  } catch (error) {
    next(error);
  }
}

async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}



async function createEmployee(req, res, next) {
  try {
    const body = req.body || {};

       const existingEmployee = await Employee.findOne({
      email: body.email,
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Duplicate value for email. email already exists.",
      });
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
      data: savedEmployee,
    });
  } catch (error) {
    next(error);
  }
}


async function editEmployee(req, res, next) {
  try {
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
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
}



async function removeEmployee(req, res, next) {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(
      req.params.id
    );

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getStatistics(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

async function searchEmployeeList(req, res, next) {
  try {
    const {
      name,
      email,
      department,
      status,
      query,
    } = req.query;

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

    const employees = await Employee.find(filter);

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  getStatistics,
  searchEmployeeList,
};