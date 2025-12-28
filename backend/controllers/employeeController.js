// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// export const createEmployee = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     // 1. Validate input
//     if (!name || !email) {
//       return res.status(400).json({
//         message: "Name and email are required",
//       });
//     }

//     // 2. Check if employee already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({
//         message: "User already exists with this email",
//       });
//     }

//     // 3. Generate default password (industry simple approach)
//     const defaultPassword = "employee@123";
//     const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//     // 4. Create employee
//     const employee = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "EMPLOYEE",
//     });

//     // 5. Response
//     res.status(201).json({
//       message: "Employee created successfully",
//       employee: {
//         id: employee._id,
//         name: employee.name,
//         email: employee.email,
//         role: employee.role,
//       },
//       credentials: {
//         email: employee.email,
//         password: defaultPassword, // later we’ll email this
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// export const employeeDashboard = async (req, res) => {
//   try {
//     // req.user middleware se aa raha hai
//     const employeeId = req.user.id;

//     const employee = await User.findById(employeeId).select("-password");

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json({
//       message: "Employee dashboard data",
//       employee: {
//         id: employee._id,
//         name: employee.name,
//         email: employee.email,
//         role: employee.role,
//       },
//       tasks: [], // future me real tasks aayenge
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// export const getAllEmployees = async (req, res) => {
//   try {
//     const employees = await User.find(
//       { role: "EMPLOYEE" },
//       "name email status createdAt"
//     ).sort({ createdAt: -1 });

//     res.status(200).json({
//       count: employees.length,
//       employees,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employees",
//       error: error.message,
//     });
//   }
// };

// export const getEmployeeById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const employee = await User.findById(id).select("-password");
//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }
//     res.status(200).json({
//       message: "Employee found",
//       employee,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employee",
//       error: error.message,
//     });
//   }
// };


// // new update by Aman
// export const getEmployeesForRefer = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const task = await Task.findById(taskId).populate(
//       "assignedBy",
//       "name email"
//     );

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Allow refer to only original assigner
//     res.status(200).json({
//       employee: task.assignedBy, // Single employee object
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Could not load target", error: error.message });
//   }
// };





import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. Validate input
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // 2. Check if employee already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // 3. Generate default password (industry simple approach)
    const defaultPassword = "employee@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 4. Create employee
    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
    });

    // 5. Response
    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      credentials: {
        email: employee.email,
        password: defaultPassword, // later we’ll email this
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const employeeDashboard = async (req, res) => {
  try {
    // req.user middleware se aa raha hai
    const employeeId = req.user.id;

    const employee = await User.findById(employeeId).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee dashboard data",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      tasks: [], // future me real tasks aayenge
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }
    res.status(200).json({
      message: "Employee found",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const employee = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

// CEO – Get full employee list (status + dates + everything)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find(
      { role: "EMPLOYEE" },
      "name email status createdAt"
    ).sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// EMPLOYEE – Get only name + email + id (For Refer Task dropdown)
export const getEmployeesBasic = async (req, res) => {
  try {
    const employees = await User.find(
      { role: "EMPLOYEE", status: "ACTIVE" },
      "name email"
    ).sort({ name: 1 });

    res.status(200).json({
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load employee basic list",
      error: error.message,
    });
  }
};

export const getEmployeesForRefer = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate(
      "assignedBy",
      "name email"
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Allow refer to only original assigner
    res.status(200).json({
      employee: task.assignedBy, // Single employee object
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not load target", error: error.message });
  }
};