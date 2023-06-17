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
import { ValidationError } from "express-validator";

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
const tryToAddTask = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  delete req.body.user;
  let newTask;
  try {
    newTask = await addTask(req.body, userId);
    res.json(newTask);
  } catch (e) {
    res.status(400).json(e);
  }
};

// @desc Update task
// @route PATCH /api/task/:id
// @access Private
const tryToUpdateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.user;
    try {
      const updatedTask = await updateTask(req.params.id, req.body);
      res.json(updatedTask);
    } catch (e) {
      res.status(400).json(e);
    }
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
