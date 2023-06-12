import * as scheduleLib from "node-schedule";
import * as _ from "lodash";
import ScheduledNotification from "../models/ScheduleModel";
import { Task } from "../models/TaskModel";
import nodemailer, { Transporter } from "nodemailer";
import User, { UserType } from "../models/UserModel";

interface ScheduleData {
  reminderDate: string[] | string;
  reminderTime: string;
  title: string;
  content: string;
  progress: number;
}

// const mailTransporter = nodemailer.createTransport({
//   host: "smtp.sendgrid.net",
//   port: 587,
//   auth: {
//     user: "apikey",
//     pass: "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",
//   },
// });

const mailTransporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "tzehengleong567@gmail.com",
    pass: "hibiubieouhsizsp",
  },
});

const schedule: Record<string, any> = {};

// schedule.createSchedule = async (task: Task): Promise<void> => {
// const { title, reminderDateTime, content, progress } = task;
// try {
//   const scheduledNotification = new ScheduledNotification({
//     reminderDate: reminderDateTime.toISOString().split("T")[0],
//     reminderTime: reminderDateTime.toISOString().split("T")[1],
//     notification: {
//       title: title,
//       content: content,
//       progress: progress,
//     },
//   });
// schedule.createSchedule = async (data: ScheduleData): Promise<void> => {
//   try {
//     const scheduledNotification = new ScheduledNotification({
//       reminderDate: data.reminderDate,
//       reminderTime: data.reminderTime,
//       notification: {
//         title: data.title,
//         content: data.content,
//         progress: data.progress,
//       },
//     });
//     await scheduledNotification.save();
//     const dayOfWeek = data.reminderDate?.join(",");
//     const timeToSent = data.reminderTime?.split(":");
//     let hours: string = "";
//     let minutes: string = "";
//     if (timeToSent) {
//       hours = timeToSent[0];
//       minutes = timeToSent[1];
//     }
//     const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;
//     const scheduleId = scheduledNotification._id.toString();
//     scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
//       // Put send email notification function here
//       // const user = await User.find();
//       // const chunks = _.chunk(user, 500);
//       // const promises = chunks.map((u: UserType) => {
//       //   // const tokens = [];
//       //   // u.array.forEach((item) => {
//       //   //   if (item.token) {
//       //   //     tokens.push(item.token);
//       //   //   }
//       //   // });
//       //   // const payload = {
//       //   //   tokens,
//       //   //   title: task.title,
//       //   //   body: task.body,
//       //   // };
//       // });
//       // await Promise.all(promises);

//       const payload = {
//         title: data.title,
//         content: data.content,
//         progress: data.progress,
//       };
//       try {
//         const emailStruc = {
//           from: "tzehengleong567@gmail.com",
//           to: "tzehengleong567@gmail.com",
//           subject: payload.title,
//           text: payload.content,
//         };
//         await mailTransporter.sendMail(emailStruc);
//       } catch (error) {
//         throw error;
//       }
//     });
//   } catch (error) {
//     throw error;
//   }
// };

schedule.createSchedule = async (data: Task): Promise<void> => {
  try {
    const scheduledNotification = new ScheduledNotification({
      reminderDate: data.dueDateTime?.getDay?.toString(),
      // reminderDate: new Date("2023-06-30T14:00:00").getDay().toString(),

      reminderTime: data.dueDateTime?.toDateString().split(" ")[1],
      notification: {
        title: data.title,
        content: data.content,
      },
    });
    // await scheduledNotification.save();
    console.log("====================================");
    console.log(scheduledNotification);
    console.log("====================================");
    // const dayOfWeek = data.reminderDate?.join(",");
    const dayOfWeek: string | undefined = data.dueDateTime?.getDay().toString();
    // const timeToSent = data.reminderDateTime?.split(":");
    const hours: string | undefined = data.dueDateTime?.getHours().toString();
    const minutes: string | undefined = data.dueDateTime
      ?.getMinutes()
      .toString();
    // if (timeToSent) {
    //   hours = timeToSent[0];
    //   minutes = timeToSent[1];
    // }
    const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;
    const scheduleId = scheduledNotification._id.toString();
    scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
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
          text: {
            content: payload.content,
          },
        };
        await mailTransporter.sendMail(emailStruc);
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};

schedule.reSchedule = async (): Promise<void> => {
  try {
    const scheduledNotifications = await ScheduledNotification.find({});
    scheduledNotifications.forEach(async (scheduledNotification: any) => {
      const dayOfWeek = scheduledNotification.reminderDate.join(",");
      const timeToSent = scheduledNotification.reminderTime.split(":");
      const hours = timeToSent[0];
      const minutes = timeToSent[1];
      const scheduleId = scheduledNotification._id.toString();
      const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;
      scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
        const user = await User.find();
      });
    });
  } catch (error) {}
};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

export default schedule;
