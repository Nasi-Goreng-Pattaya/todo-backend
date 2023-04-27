import { NextFunction, Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { deleteTask, getTasks, updateTask, addTask } from "../services/TaskService"

// @desc Get user's tasks data
// @route GET /api/task
// @access Private
const tryToGetTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await getTasks(req.body.user.id)
    res.json(tasks)
})

// @desc Add new task to user's tasks
// @route POST /api/task
// @access Private
const tryToAddTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.user.id
    delete req.body.user
    const newTask = await addTask(req.body, userId)
    res.json(newTask)
})

// @desc Update task
// @route PATCH /api/task/:id
// @access Private
const tryToUpdateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.user
    const updatedTask = await updateTask(req.params.id, req.body)
    res.json(updatedTask)
})

// @desc Delete task
// @route DELETE /api/task/:id
// @access Private
const tryToDeleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const deletedTask = await deleteTask(req.params.id)
    res.json(deletedTask) 
})

export {
    tryToGetTasks as getTasks,
    tryToAddTask as addTask,
    tryToUpdateTask as updateTask,
    tryToDeleteTask as deleteTask,
}
