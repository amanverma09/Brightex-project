import express from "express";
import {
  assignTask,
  ceoTaskDashboard,
  getAllTasksForCEO,
  getMyTasks,
  getPendingTasksForCEO,
  reassignTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCEO, isEmployee } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CEO assigns task
router.post("/assign", verifyToken, isCEO, assignTask);

// Employee views own tasks
router.get("/my", verifyToken, isEmployee, getMyTasks);

// Employee updates task status
router.patch("/:taskId/status", verifyToken, isEmployee, updateTaskStatus);

router.patch(
  "/:taskId/reassign", verifyToken, isCEO, reassignTask
);

// CEO task dashboard
router.get("/ceo/dashboard", verifyToken, isCEO, ceoTaskDashboard);

// CEO views all tasks
router.get("/ceo/all", verifyToken, isCEO, getAllTasksForCEO);

// CEO pending work (overdue tasks)
router.get("/ceo/pending", verifyToken, isCEO, getPendingTasksForCEO);
export default router;
