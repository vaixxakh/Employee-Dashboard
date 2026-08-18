const { Router } = require("express");

const {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  searchEmployeeList,
} = require("../controllers/employeeController");

const router = Router();

router.get("/employees", listEmployees);

router.get("/employees/search", searchEmployeeList);

router.get("/employees/:id", getEmployee);

router.post("/employees", createEmployee);
router.put("/employees/:id", editEmployee);
router.delete("/employees/:id", removeEmployee);

module.exports = router;
