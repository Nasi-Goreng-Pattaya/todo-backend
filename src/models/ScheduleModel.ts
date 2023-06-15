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
      default: null,
      required: false,
    },
    reminderTime: {
      type: String,
      default: null,
      required: false,
    },
    notification: {
      type: Object,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface ScheduleData {
  taskId: string;
  reminderDate: string;
  reminderTime: string;
  title: string;
  content: string;
}

export type Schedule = InferSchemaType<typeof reminderSchema>;

export default mongoose.model("scheduledNotification", reminderSchema);
