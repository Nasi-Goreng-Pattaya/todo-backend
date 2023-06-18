import express, { Response, Request } from "express";
import {
  addSchedule,
  deleteDueSchedule,
  getSchedule,
} from "../controls/ScheduleController";

export const reminderRouter = express.Router();

reminderRouter.post("/createSchedule", addSchedule);

reminderRouter.get("/fetchNotification", getSchedule);

reminderRouter.delete("/deleteNotification", deleteDueSchedule);

reminderRouter.put("/updateNotification");
