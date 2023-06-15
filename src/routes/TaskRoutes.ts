import express from "express";
import {
  getTasks,
  updateTask,
  deleteTask,
  addTask,
  getTaskById,
} from "../controls/TaskController";
import { protect } from "../middlewares/AuthMiddleware";

export const taskRouter = express.Router();

taskRouter.route("/").get(protect, getTasks).post(protect, addTask);
taskRouter
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
