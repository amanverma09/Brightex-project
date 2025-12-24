import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCEO } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isCEO, (req, res) => {
  res.status(200).json({
    message: "Welcome to CEO Dashboard",
    ceoId: req.user.id,
    role: req.user.role,
    status: req.user.status,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
