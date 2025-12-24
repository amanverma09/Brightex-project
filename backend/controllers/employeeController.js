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
