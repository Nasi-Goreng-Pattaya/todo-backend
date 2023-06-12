import mongoose, { Document, InferSchemaType, Types } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    hasReminder: {
      type: Boolean,
      required: true,
    },
    reminderDateTime: {
      type: Date,
      default: null,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
    },
    dueDateTime: {
      type: Date,
      required: [true, "Please select a due date"],
      validate: {
        validator: (v: Date) => {
          return v > new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
    status: {
      type: String,
      enum: ["todo", "inprogress", "completed"],
      default: "todo",
    },
  },
  {
    timestamps: true,
  }
);

export type Task = InferSchemaType<typeof taskSchema>;

export default mongoose.model("Task", taskSchema);
