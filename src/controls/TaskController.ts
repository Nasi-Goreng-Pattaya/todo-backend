import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  deleteTask,
  getTasks,
  updateTask,
  addTask,
  getTaskById,
} from "../services/TaskService";
import Task from "../models/TaskModel";

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

// @desc Add new task to user's tasks
// @route POST /api/task
// @access Private
const tryToAddTask: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.user.id;
  delete req.body.user;
  const newTask = await addTask(req.body, userId);
  res.json(newTask);
};

// @desc Update task
// @route PATCH /api/task/:id
// @access Private
const tryToUpdateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.user;
    const updatedTask = await updateTask(req.params.id, req.body);
    res.json(updatedTask);
  }
);

// @desc Delete task
// @route DELETE /api/task/:id
// @access Private
const tryToDeleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedTask = await deleteTask(req.params.id);
    res.json(deletedTask);
  }
);

export {
  tryToGetTasks as getTasks,
  tryToGetTaskById as getTaskById,
  tryToAddTask as addTask,
  tryToUpdateTask as updateTask,
  tryToDeleteTask as deleteTask,
};
