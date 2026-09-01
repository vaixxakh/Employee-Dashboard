const express = require("express");

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  listEmployees,
  getEmployee,
  createEmployee,
  editEmployee,
  removeEmployee,
  uploadEmployeeProfileImage,
  deleteEmployeeProfileImage,
  getStatistics,
  searchEmployeeList,
} = require("../controllers/employeeController");

const { uploadEmployeeImage } = require("../middleware/uploadMiddleware");

const { validateImageContent } = require("../middleware/imageContentValidator");

const router = express.Router();

router.use(protect);

router.get("/employees", listEmployees);

router.get("/employees/search", searchEmployeeList);

router.get("/employees/statistics", getStatistics);

router.get("/employees/:id", getEmployee);

router.post("/employees", authorize("Admin"), createEmployee);

router.put("/employees/:id", authorize("Admin"), editEmployee);

router.delete("/employees/:id", authorize("Admin"), removeEmployee);

router.post(
  "/employees/:id/profile-image",
  authorize("Admin"),
  uploadEmployeeImage.single("profileImage"),
  validateImageContent,
  uploadEmployeeProfileImage
);

router.delete(
  "/employees/:id/profile-image",
  authorize("Admin"),
  deleteEmployeeProfileImage
);

module.exports = router;
