import express from "express";
import { ceoLogin, employeeLogin } from "../controllers/authController.js";

const router = express.Router();

// CEO login
router.post("/ceo/login", ceoLogin);

// Employee login
router.post("/employee/login", employeeLogin);

export default router;
