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
      required: false,
    },
    reminderTime: {
      type: String,
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

const ScheduledNotification = mongoose.model(
  "scheduledNotification",
  reminderSchema
);

export default ScheduledNotification;
