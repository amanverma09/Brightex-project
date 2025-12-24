import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCEO, isEmployee } from "../middleware/roleMiddleware.js";
import {
  createEmployee,
  employeeDashboard,
  getAllEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

// CEO creates employee
router.post("/create", verifyToken, isCEO, createEmployee);

router.get("/dashboard", verifyToken, isEmployee, employeeDashboard);

// CEO → Get all employees
router.get("/", verifyToken, isCEO, getAllEmployees);
export default router;
