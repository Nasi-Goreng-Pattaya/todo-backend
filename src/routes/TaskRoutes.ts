import express from "express";
import {
  getTasks,
  updateTask,
  deleteTask,
  addTask,
  getTaskById,
} from "../controls/TaskController";
import { protect } from "../middlewares/AuthMiddleware";
import {
  addSchedule,
  deleteSchedule,
  updateSchedule,
} from "../controls/ScheduleController";

export const taskRouter = express.Router();

taskRouter
  .route("/")
  .get(protect, getTasks, deleteSchedule)
  .post(protect, addTask);
taskRouter
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask, updateSchedule)
  .delete(protect, deleteTask, deleteSchedule);
