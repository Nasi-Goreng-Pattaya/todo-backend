import express, { Response, Request } from "express";
import schedule from "../services/ScheduleService";
import ScheduledNotification from "../models/ScheduleModel";

export const reminderRouter = express.Router();

reminderRouter.post(
  "/scheduleNotification",
  async (req: Request, res: Response) => {
    try {
      const payload = {
        dueDateTime: req.body.dueDateTime,
        title: req.body.title,
        content: req.body.content,
        progress: req.body.progress,
      };

      await schedule.createSchedule(payload);
      res.json({
        data: {},
        message: "Success",
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, success: false });
    }
  }
);

reminderRouter.get(
  "/fetchNotification",
  async (req: Request, res: Response) => {
    try {
      const list = schedule.getJobs();
      const keys = Object.keys(list);
      let schedules = await ScheduledNotification.find({});
      schedules = schedules.filter((item: any) =>
        keys.includes(item._id.toString())
      );
      res.json({
        data: { schedules },
        status: "success",
        message: "successful",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, success: false });
    }
  }
);

reminderRouter.delete(
  "/deleteNotification",
  async (req: Request, res: Response) => {
    try {
      const activeJobId = req.body.id;
      const list = schedule.getJobs();
      const currentJob = list[activeJobId];
      if (!currentJob) {
        throw new Error("Job not found");
      }
      await ScheduledNotification.findByIdAndRemove(activeJobId);
      currentJob.cancel();
      res.json({
        data: {},
        status: "success",
        message: "successful",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, success: false });
    }
  }
);
