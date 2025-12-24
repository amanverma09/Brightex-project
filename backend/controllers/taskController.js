import Task from "../models/Task.js";
import User from "../models/User.js";

export const assignTask = async (req, res) => {
  try {
    console.log("========== ASSIGN TASK API HIT ==========");
    console.log("REQ.USER =>", req.user); // 🔍 token / auth check
    console.log("REQ.BODY =>", req.body); // 🔍 frontend payload

    const { title, description, assignedTo, deadline, priority } = req.body;

    // 1️⃣ Validate input
    if (!title || !description || !assignedTo || !deadline) {
      console.log("❌ VALIDATION FAILED");
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 2️⃣ Check employee exists
    console.log("🔍 Checking employee:", assignedTo);
    const employee = await User.findById(assignedTo);
    console.log("EMPLOYEE FOUND =>", employee);

    if (!employee || employee.role !== "EMPLOYEE") {
      console.log("❌ EMPLOYEE NOT FOUND OR ROLE MISMATCH");
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // 3️⃣ Check req.user
    if (!req.user || !req.user.id) {
      console.log("❌ req.user.id MISSING");
      return res.status(401).json({
        message: "Unauthorized: user not found in token",
      });
    }

    // 4️⃣ Create task
    console.log("🛠 Creating task...");
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      deadline: new Date(deadline),
      priority,
      status: "PENDING",
    });

    console.log("✅ TASK CREATED =>", task);

    res.status(201).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error("🔥 ASSIGN TASK ERROR =>", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Employee fetching their tasks
export const getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const tasks = await Task.find({ assignedTo: employeeId })
      .select("-__v")
      .sort({ deadline: 1, priority: -1 });

    res.status(200).json({
      message: "My tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const employeeId = req.user.id;

    // 1. Validate status
    const allowedStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    // 2. Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 3. Ownership check (IMPORTANT)
    if (task.assignedTo.toString() !== employeeId) {
      return res.status(403).json({
        message: "You can update only your assigned tasks",
      });
    }

    // 4. Update status
    task.status = status;
    await task.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task: {
        id: task._id,
        title: task.title,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const ceoTaskDashboard = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    const pendingTasks = await Task.countDocuments({
      status: "PENDING",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "IN_PROGRESS",
    });

    const completedTasks = await Task.countDocuments({
      status: "COMPLETED",
    });

    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: new Date() },
      status: { $ne: "COMPLETED" },
    });

    res.status(200).json({
      message: "CEO task dashboard data",
      dashboard: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllTasksForCEO = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getPendingTasksForCEO = async (req, res) => {
  try {
    const today = new Date();

    const pendingTasks = await Task.find({
      deadline: { $lt: today },
      status: { $ne: "COMPLETED" },
    })
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    res.status(200).json({
      message: "Pending (overdue) tasks fetched successfully",
      count: pendingTasks.length,
      tasks: pendingTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
