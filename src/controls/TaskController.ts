import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  deleteTask,
  getTasks,
  updateTask,
  addTask,
  getTaskById,
} from "../services/TaskService";
import moment from "moment";
import schedule from "../services/ScheduleService";
import TaskModel, { Task } from "../models/TaskModel";
import ScheduledNotification from "../models/ScheduleModel";
import * as scheduleLib from "node-schedule";
import { ScheduleData } from "../models/ScheduleModel";

// @desc Get user's tasks data
// @route GET /api/task
// @access Private
const tryToGetTasks: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await getTasks(req.body.user.id);

    res.json(tasks);
  }
);

const tryToGetTaskById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await getTaskById(req.params.id, req.body.user.id);
    res.json(tasks);
  }
);

function reminderChecking(
  currentDateTime: string,
  dueDateTime: Date,
  hourPrior: number
): string {
  let reminderDateTime = moment(dueDateTime)
    .subtract(hourPrior, "hour")
    .format("YYYY-MM-DD HH:mm");
  if (reminderDateTime > currentDateTime) {
    return reminderDateTime;
  } else {
    return reminderChecking(currentDateTime, dueDateTime, hourPrior / 2.0);
  }
}

// @desc Add new task to user's tasks
// @route POST /api/task
// @access Private
const tryToAddTask = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  delete req.body.user;
  let newTask;
  try {
    newTask = await addTask(req.body, userId);
  } catch (e) {
    res.status(400).json(e);
    return;
  }
  const reminderFlag = req.body.hasReminder;
  const prior = req.body.priority;
  const dueDateTime = req.body.dueDateTime;
  const scheduleTaskId = newTask._id;
  let reminderDateTime = "";
  // let reminderDate = "";
  // let reminderTime = "";
  if (!reminderFlag || prior === "low") {
    res.json(newTask);
    return;
  }
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm");
  if (reminderFlag) {
    if (prior) {
      if (prior === "medium") {
        reminderDateTime = reminderChecking(currentDateTime, dueDateTime, 3);

        // reminderDate = moment(dueDateTime)
        //   .subtract(3, "hour")
        //   .format("YYYY-MM-DD");
        // reminderTime = moment(dueDateTime).subtract(3, "hour").format("HH:mm");
      } else if (prior === "high") {
        reminderDateTime = reminderChecking(currentDateTime, dueDateTime, 6);

        // reminderDate = moment(dueDateTime)
        //   .subtract(6, "hour")
        //   .format("YYYY-MM-DD");
        // reminderTime = moment(dueDateTime).subtract(6, "hour").format("HH:mm");
      }
    }
  }
  try {
    const payload = {
      taskId: scheduleTaskId,
      reminderDate: moment(reminderDateTime).format("YYYY-MM-DD"),
      reminderTime: moment(reminderDateTime).format("HH:mm"),
      title: req.body.title,
      content: req.body.content,
    };

    await schedule.createSchedule(payload, userId);
    // console.log(scheduleLib.scheduledJobs);
    // await ScheduleModel.updateOne({ taskId: newTask._id });
    res.json(newTask);
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// @desc Update task
// @route PATCH /api/task/:id
// @access Private
const tryToUpdateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.user;
    let updatedTask;
    const taskId = req.params.id;
    const taskPayload = req.body as Task;
    let markAsNotCompleted = false;
    const oldTask = await getTaskById(taskId, taskPayload.userId.toString());
    if (
      ((oldTask?.completedDateTime === undefined ||
        oldTask.completedDateTime === null) &&
        taskPayload.status === "completed") ||
      (oldTask?.status !== "completed" && taskPayload.status === "completed")
    ) {
      taskPayload.completedDateTime = new Date();
    } else if (taskPayload.status !== "completed") {
      markAsNotCompleted = true;
    }

    try {
      updatedTask = await updateTask(taskId, taskPayload, markAsNotCompleted);
    } catch (e) {
      res.status(400).json(e);
      return;
    }
    const scheduleList = schedule.getJobs();
    console.log(scheduleList);
    console.log(req.body);
    const userId = req.body.userId;
    const reminderFlag = req.body.hasReminder;
    const prior = req.body.priority;
    const dueDateTime = req.body.dueDateTime;
    const existingTask = await TaskModel.findById(taskId);
    let reminderDateTime = "";
    let reminderDate = "";
    let reminderTime = "";
    if (!reminderFlag || prior === "low") {
      res.json(updatedTask);
      return;
    }
    const currentDateTime = moment().format("YYYY-MM-DD HH:mm");
    if (reminderFlag) {
      if (dueDateTime !== existingTask?.dueDateTime) {
        if (prior) {
          if (prior === "medium") {
            reminderDateTime = reminderChecking(
              currentDateTime,
              dueDateTime,
              3
            );
          } else if (prior === "high") {
            reminderDateTime = reminderChecking(
              currentDateTime,
              dueDateTime,
              6
            );
          }
        }
      }
    }
    console.log({ reminderDateTime });
    try {
      const hours = moment(reminderDateTime).hours();
      const minutes = moment(reminderDateTime).minutes();
      const day = moment(reminderDateTime).day();
      const month = moment(reminderDateTime).month();
      const scheduleTimeOut = `${minutes} ${hours} ${day} ${month} *`;
      const matchingTaskId = await ScheduledNotification.findOne({
        taskId: taskId,
      });
      const payload = {
        taskId: taskId,
        reminderDate: moment(reminderDateTime).format("YYYY-MM-DD"),
        reminderTime: moment(reminderDateTime).format("HH:mm"),
        title: req.body.title,
        content: req.body.content,
      };
      const matchingScheduleId = matchingTaskId?._id;
      if (matchingTaskId && matchingScheduleId) {
        const matchingJob = scheduleList[
          matchingScheduleId.toString()
        ] as scheduleLib.Job;
        await ScheduledNotification.updateOne(
          { taskId: taskId },
          {
            reminderDate: moment(reminderDateTime).format("YYYY-MM-DD"),
            reminderTime: moment(reminderDateTime).format("HH:mm"),
            title: req.body.title,
            content: req.body.content,
          }
        );

        if (updatedTask?.status === "completed") {
          matchingJob.cancel();
        } else {
          matchingJob.cancel();
          await schedule.createSchedule(payload, userId);
          // console.log(
          //   moment(matchingJob.nextInvocation().toISOString()).format(
          //     "YYYY/MM/DD HH:mm"
          //   )
          // );
          // const scheduleSuccess = matchingJob.reschedule(scheduleTimeOut);
          // console.log("Successfully rescheduled:", scheduleSuccess);
        }
      }
      if (!matchingScheduleId) {
        await schedule.createSchedule(payload, userId);
      }
      res.json(updatedTask);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message, success: false });
    }
  }
);

// @desc Delete task
// @route DELETE /api/task/:id
// @access Private
const tryToDeleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedTask = await deleteTask(req.params.id);
    const taskId = req.params.id;

    try {
      const scheduleList = schedule.getJobs();
      console.log(scheduleList);
      const matchingTaskId = await ScheduledNotification.findOne({
        taskId: taskId,
      });
      const matchingScheduleId = matchingTaskId?._id;
      if (matchingTaskId && matchingScheduleId) {
        const matchingJob = scheduleList[
          matchingScheduleId.toString()
        ] as scheduleLib.Job;
        matchingJob.cancel();
        await ScheduledNotification.deleteOne({ taskId: taskId });
      } else {
        throw new Error("Schedule does not exist!");
      }
      res.json({
        tasks: deleteTask,
        schedule: { scheduleList },
        status: "success",
        message: "Delete task and schedule successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, success: false });
    }
  }
);

export {
  tryToGetTasks as getTasks,
  tryToGetTaskById as getTaskById,
  tryToAddTask as addTask,
  tryToUpdateTask as updateTask,
  tryToDeleteTask as deleteTask,
};
