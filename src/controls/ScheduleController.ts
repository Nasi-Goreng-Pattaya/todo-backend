import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import schedule from "../services/ScheduleService";
import ScheduledNotification from "../models/ScheduleModel";
import moment from "moment";
import TaskModel from "../models/TaskModel";

const tryToGetSchedule: RequestHandler = asyncHandler(
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

const tryToAddSchedule: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reminderFlag = req.body.hasReminder;
  const prior = req.body.priority;
  const dueDateTime = req.body.dueDateTime;
  let reminderDate = "";
  let reminderTime = "";
  if (reminderFlag) {
    if (prior) {
      if (prior === "low") {
        reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
        reminderTime = moment(dueDateTime).subtract(1, "hour").format("HH:mm");
      } else if (prior === "medium") {
        reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
        reminderTime = moment(dueDateTime).subtract(3, "hour").format("HH:mm");
      } else if (prior === "high") {
        reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
        reminderTime = moment(dueDateTime).subtract(6, "hour").format("HH:mm");
      }
    }
  }
  try {
    const payload = {
      reminderDate: reminderDate,
      reminderTime: reminderTime,
      title: req.body.title,
      content: req.body.content,
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
};

const tryToUpdateSchedule: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.body._id;
    const reminderFlag = req.body.hasReminder;
    const prior = req.body.priority;
    const dueDateTime = req.body.dueDateTime;
    const existingTask = await TaskModel.findById(taskId);
    let reminderDate = "";
    let reminderTime = "";
    if (reminderFlag) {
      if (dueDateTime !== existingTask?.dueDateTime) {
        if (prior) {
          if (prior === "low") {
            reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
            reminderTime = moment(dueDateTime)
              .subtract(1, "hour")
              .format("HH:mm");
          } else if (prior === "medium") {
            reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
            reminderTime = moment(dueDateTime)
              .subtract(3, "hour")
              .format("HH:mm");
          } else if (prior === "high") {
            reminderDate = moment(dueDateTime).format("YYYY-MM-DD");
            reminderTime = moment(dueDateTime)
              .subtract(6, "hour")
              .format("HH:mm");
          }
        }
      }
    }
    try {
      const payload = {
        reminderDate: reminderDate,
        reminderTime: reminderTime,
        title: req.body.title,
        content: req.body.content,
      };

      await schedule.updateSchedule(payload);
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

const tryToReschedule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const reschedule = schedule.reSchedule();
    // res.json(updatedTask);
  }
);

const tryToDeleteSchedule = asyncHandler(
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

export {
  tryToGetSchedule as getSchedule,
  tryToAddSchedule as addSchedule,
  tryToUpdateSchedule as updateSchedule,
  tryToDeleteSchedule as deleteSchedule,
};
