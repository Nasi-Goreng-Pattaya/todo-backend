import * as scheduleLib from "node-schedule";
import * as _ from "lodash";
import ScheduledNotification, {
  Schedule,
  ScheduleData,
} from "../models/ScheduleModel";
import nodemailer, { Transporter } from "nodemailer";
import User from "../models/UserModel";
import TaskModel from "../models/TaskModel";
import UserModel from "../models/UserModel";
import dotenv from "dotenv";

dotenv.config();

const mailTransporter: Transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_API_KEY,
  },
});

const schedule: Record<string, any> = {};

schedule.createSchedule = async (
  data: ScheduleData,
  userId: string
): Promise<void> => {
  try {
    const user = await UserModel.findById(userId).exec();
    console.log(user?.email);
    const scheduledNotification = new ScheduledNotification({
      taskId: data.taskId,
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
    let hours: number = 0;
    let minutes: number = 0;
    let day: number = 0;
    let month: number = 0;
    let year: number = 0;
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
            from: "4amnasigorengpattaya@gmail.com",
            to: user?.email,
            subject: payload.title,
            text: payload.content,
          };
          const sendResult = await mailTransporter.sendMail(emailStruc);
          console.log(sendResult);
          console.log("Email Sent!");
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    );
    console.log(job);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

schedule.reSchedule = async (): Promise<void> => {
  try {
    const scheduledNotifications = await ScheduledNotification.find({}).exec();
    scheduledNotifications.forEach(async (scheduledNotification) => {
      const task = await TaskModel.findById(
        scheduledNotification.taskId
      ).exec();
      const user = await UserModel.findById(task?.userId).exec();
      const dayToSent = scheduledNotification.reminderDate.split("-");
      const timeToSent = scheduledNotification.reminderTime.split(":");
      const hours = parseInt(timeToSent[0]);
      const minutes = parseInt(timeToSent[1]);
      const day = parseInt(dayToSent[2]);
      const month = parseInt(dayToSent[1]);
      const year = parseInt(dayToSent[0]);
      const scheduleId = scheduledNotification._id.toString();
      const scheduleTimeout = `${minutes} ${hours} ${day} ${month} *`;
      const job = scheduleLib.scheduleJob(
        scheduleId,
        scheduleTimeout,
        async () => {
          const payload = {
            title: task?.title,
            content: task?.content,
          };
          try {
            const emailStruc = {
              from: "4amnasigorengpattaya@gmail.com",
              to: user?.email,
              subject: payload.title,
              text: payload.content,
            };
            const sendResult = await mailTransporter.sendMail(emailStruc);
            console.log(sendResult);
            console.log("Email Sent!");
          } catch (error) {
            console.log(error);
            throw error;
          }
        }
      );
      console.log(job);
    });
  } catch (error) {
    throw error;
  }
};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

schedule.updateSchedule = async (data: ScheduleData) => {
  const scheduleId = data.taskId;
  try {
    let originalSchedule = await ScheduledNotification.findById(scheduleId);
    if (originalSchedule) {
      originalSchedule.reminderDate = data.reminderDate;
      originalSchedule.reminderTime = data.reminderTime;
      await originalSchedule.save();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default schedule;
