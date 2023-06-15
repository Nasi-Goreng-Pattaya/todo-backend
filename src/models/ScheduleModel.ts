import mongoose, { InferSchemaType } from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    // reminderDateTime: {
    //   type: Date,
    //   default: null,
    //   required: false,
    // },
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

export type Schedule = InferSchemaType<typeof reminderSchema>;

// const ScheduledNotification =

export default mongoose.model("scheduledNotification", reminderSchema);
