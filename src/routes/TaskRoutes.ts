import express from "express";
import {
  getTasks,
  updateTask,
  deleteTask,
  addTask,
} from "../controls/TaskController";
import { protect } from "../middlewares/AuthMiddleware";

export const taskRouter = express.Router();

taskRouter.route("/").get(protect, getTasks).post(protect, addTask);
taskRouter.route("/:id").patch(protect, updateTask).delete(protect, deleteTask);
