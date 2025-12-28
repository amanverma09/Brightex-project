// import express from "express";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import { isCEO, isEmployee } from "../middleware/roleMiddleware.js";
// import {
//   createEmployee,
//   employeeDashboard,
//   getAllEmployees,
// } from "../controllers/employeeController.js";

// const router = express.Router();

// // CEO creates employee
// router.post("/create", verifyToken, isCEO, createEmployee);

// router.get("/dashboard", verifyToken, isEmployee, employeeDashboard);

// // CEO → Get all employees
// router.get("/", verifyToken, isCEO, getAllEmployees);
// export default router;



import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCEO, isEmployee } from "../middleware/roleMiddleware.js";
import {
  createEmployee,
  deleteEmployee,
  employeeDashboard,
  getEmployeeById,
  getAllEmployees,
  getEmployeesBasic,
  getEmployeesForRefer,
  updateEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

// CEO creates employee
router.post("/create", verifyToken, isCEO, createEmployee);

// Get employee dashboard
router.get("/dashboard", verifyToken, isEmployee, employeeDashboard);

// update employee
router.put("/:id", verifyToken, isCEO, updateEmployee);

// delete employee
router.delete("/:id", verifyToken, isCEO, deleteEmployee);

// Get employees for task referral
router.get(
  "/refer/target/:taskId",
  verifyToken,
  isEmployee,
  getEmployeesForRefer
);

// Get basic employee information
router.get("/basic-list", verifyToken, isEmployee, getEmployeesBasic);

// CEO → Get all employees
router.get("/", verifyToken, isCEO, getAllEmployees);

// get employee by id
router.get("/:id", verifyToken, isCEO, getEmployeeById);

export default router;