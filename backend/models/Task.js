import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"],
      default: "PENDING",
    },

    /* ================= NEW FIELDS ================= */

    rescheduledCount: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    reassignHistory: [
      {
        oldDeadline: Date,
        newDeadline: Date,
        reassignedAt: {
          type: Date,
          default: Date.now,
        },
        reassignedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // CEO
        },
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
