import mongoose, { InferSchemaType, Schema } from "mongoose";
import Types from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    reminderDate: {
      type: String,
      required: true,
    },
    reminderTime: {
      type: String,
      required: true,
    },
    notification: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export interface ScheduleData {
  scheduleId: string;
  taskId: string;
  reminderDate: string;
  reminderTime: string;
  title: string;
  content: string;
}

export type Schedule = InferSchemaType<typeof reminderSchema>;

export default mongoose.model("scheduledNotification", reminderSchema);
