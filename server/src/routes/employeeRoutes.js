const express = require("express");

const {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  getStatistics,
  searchEmployeeList,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/employees", listEmployees);

router.get("/employees/search", searchEmployeeList);

router.get("/employees/statistics", getStatistics);

router.get("/employees/:id", getEmployee);

router.post("/employees", createEmployee);

router.put("/employees/:id", editEmployee);

router.delete("/employees/:id", removeEmployee);

module.exports = router;