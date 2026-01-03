import express from "express";
import {
  assignTask,
  ceoTaskDashboard,
  deleteTask,
  getAllTasksForCEO,
  getMyTasks,
  getOverdueTasksForCEO,
  getTasksByStatusForCEO,
  reassignTask,
  referTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCEO, isEmployee } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CEO assigns task
router.post("/assign", verifyToken, isCEO, assignTask);

// Employee views own tasks
router.get("/my", verifyToken, isEmployee, getMyTasks);

// delete task
router.delete("/:taskId", verifyToken, isCEO, deleteTask);

// Employee updates task status
router.patch("/:taskId/status", verifyToken, isEmployee, updateTaskStatus);

// CEO reassigns task
router.patch("/:taskId/reassign", verifyToken, isCEO, reassignTask);

// CEO task dashboard
router.get("/ceo/dashboard", verifyToken, isCEO, ceoTaskDashboard);

// CEO views all tasks
router.get("/ceo/all", verifyToken, isCEO, getAllTasksForCEO);

// ✅ NEW: CEO → tasks by status
router.get("/ceo/status/:status", verifyToken, isCEO, getTasksByStatusForCEO);

// CEO → overdue tasks
router.get("/ceo/overdue", verifyToken, isCEO, getOverdueTasksForCEO);

// CEO pending work (overdue tasks)
// router.get("/ceo/pending", verifyToken, isCEO, getPendingTasksForCEO);

// Employee refers task
router.patch("/:taskId/refer", verifyToken, isEmployee, referTask);

export default router;
