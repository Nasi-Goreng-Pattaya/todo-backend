import { NextFunction, Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { deleteTask, getTasks, updateTask, addTask } from "../services/TaskService"

// @desc Get user's tasks data
// @route GET /api/task
// @access Private
const tryToGetTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await getTasks(req.body.user.id)
        res.json(tasks)
    } catch (error) {
        next(error)
    }   
})

// @desc Add new task to user's tasks
// @route POST /api/task
// @access Private
const tryToAddTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.user.id
        delete req.body.user
        const newTask = await addTask(req.body, userId)
        res.json(newTask)
    } catch (error) {
        next(error)
    }
})

// @desc Update task
// @route PATCH /api/task/:id
// @access Private
const tryToUpdateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        delete req.body.user
        const updatedTask = await updateTask(req.params.id, req.body)
        res.json(updatedTask)
    } catch (error) {
        next(error)
    }
})

// @desc Delete task
// @route DELETE /api/task/:id
// @access Private
const tryToDeleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedTask = await deleteTask(req.params.id)
        res.json(deletedTask)
    } catch (error) {
        next(error)
    }  
})

export {
    tryToGetTasks as getTasks,
    tryToAddTask as addTask,
    tryToUpdateTask as updateTask,
    tryToDeleteTask as deleteTask,
}
