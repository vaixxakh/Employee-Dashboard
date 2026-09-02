const express = require("express");

const { protect, authorize } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/asyncHandler");

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

router.get("/employees", asyncHandler(protect), asyncHandler(listEmployees));

router.get("/employees/search", asyncHandler(protect), asyncHandler(searchEmployeeList));

router.get("/employees/statistics", asyncHandler(protect), asyncHandler(getStatistics));

router.get("/employees/:id", asyncHandler(protect), asyncHandler(getEmployee));

router.post("/employees", asyncHandler(protect), authorize("Admin"), asyncHandler(createEmployee));

router.put("/employees/:id", asyncHandler(protect), authorize("Admin"), asyncHandler(editEmployee));

router.delete("/employees/:id", asyncHandler(protect), authorize("Admin"), asyncHandler(removeEmployee));

router.post(
  "/employees/:id/profile-image",
  asyncHandler(protect),
  authorize("Admin"),
  uploadEmployeeImage.single("profileImage"),
  validateImageContent,
  asyncHandler(uploadEmployeeProfileImage)
);

router.delete(
  "/employees/:id/profile-image",
  asyncHandler(protect),
  authorize("Admin"),
  asyncHandler(deleteEmployeeProfileImage)
);

module.exports = router;
