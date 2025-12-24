import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import ceoRoutes from "./routes/ceoRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes Defined here:
app.use("/api/auth", authRoutes);
app.use("/api/ceo", ceoRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);

connectDB();
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
