import express from "express";
import { ceoLogin, employeeLogin, getAuthenticatedUser, updateProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CEO login
router.post("/ceo/login", ceoLogin);

// Employee login
router.post("/employee/login", employeeLogin);

// Authenticated
router.get("/me", verifyToken, getAuthenticatedUser);
router.put("/update-profile", verifyToken, updateProfile);


export default router;
