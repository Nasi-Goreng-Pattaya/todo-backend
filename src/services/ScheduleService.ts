import * as scheduleLib from "node-schedule";
import * as _ from "lodash";
import ScheduledNotification, { Schedule } from "../models/ScheduleModel";
import nodemailer, { Transporter } from "nodemailer";
import User from "../models/UserModel";
import TaskModel from "../models/TaskModel";

interface ScheduleData {
  _id: string;
  reminderDate: string;
  reminderTime: string;
  title: string;
  content: string;
}

const mailTransporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "tzehengleong567@gmail.com",
    pass: "hibiubieouhsizsp",
  },
});

const schedule: Record<string, any> = {};

schedule.createSchedule = async (data: ScheduleData): Promise<void> => {
  try {
    const scheduledNotification = new ScheduledNotification({
      reminderDate: data.reminderDate,
      reminderTime: data.reminderTime,
      notification: {
        title: data.title,
        content: data.content,
      },
    });
    await scheduledNotification.save();
    const dayToSent = data.reminderDate?.split("-");
    const timeToSent = data.reminderTime?.split(":");
    let hours: Number = 0;
    let minutes: Number = 0;
    let day: Number = 0;
    let month: Number = 0;
    let year: Number = 0;
    if (timeToSent) {
      hours = parseInt(timeToSent[0]);
      minutes = parseInt(timeToSent[1]);
    }
    if (dayToSent) {
      day = parseInt(dayToSent[2]);
      month = parseInt(dayToSent[1]);
      year = parseInt(dayToSent[0]);
    }
    const scheduleTimeout = `${minutes} ${hours} ${day} ${month} *`;
    const scheduleId = scheduledNotification._id.toString();
    const job = scheduleLib.scheduleJob(
      scheduleId,
      scheduleTimeout,
      async () => {
        // Put send email notification function here
        const payload = {
          title: data.title,
          content: data.content,
        };
        try {
          const emailStruc = {
            from: "tzehengleong567@gmail.com",
            to: "tzehengleong567@gmail.com",
            subject: payload.title,
            text: payload.content,
          };
          await mailTransporter.sendMail(emailStruc);
        } catch (error) {
          throw error;
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

schedule.reSchedule = async (): Promise<void> => {
  try {
    const scheduledNotifications = await ScheduledNotification.find({});
    scheduledNotifications.forEach(async (scheduledNotification: any) => {
      const dayToSent = scheduledNotification.reminderDate.split("-");
      const timeToSent = scheduledNotification.reminderTime.split(":");
      const hours = parseInt(timeToSent[0]);
      const minutes = parseInt(timeToSent[1]);
      const day = parseInt(dayToSent[2]);
      const month = parseInt(dayToSent[1]);
      const year = parseInt(dayToSent[0]);
      const scheduleId = scheduledNotification._id.toString();
      const scheduleTimeout = `${minutes} ${hours} ${day} ${month} *`;
      scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
        const user = await User.find();
      });
    });
  } catch (error) {
    throw error;
  }
};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

schedule.updateSchedule = async (data: ScheduleData) => {
  const scheduleId = data._id;
  try {
    let originalSchedule = await ScheduledNotification.findById(scheduleId);
    if (originalSchedule) {
      originalSchedule.reminderDate = data.reminderDate;
      originalSchedule.reminderTime = data.reminderTime;
      await originalSchedule.save();
    }
  } catch (error) {
    throw error;
  }
};

export default schedule;