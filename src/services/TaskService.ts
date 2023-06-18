import { error } from "firebase-functions/logger";
import Task from "../models/TaskModel";

const getTasks = async (userId: string) => {
  const tasks = await Task.find({ userId });
  return tasks;
};

const getTaskById = async (taskId: string, userId: string) => {
  const tasks = await Task.findOne({ _id: taskId, userId: userId }).exec();
  return tasks;
};

const addTask = async (taskBody: Object, userId: string) => {
  const task = await Task.create({ ...taskBody, userId });
  return task;
};

const updateTask = async (
  id: string,
  newInfoBody: Object,
  markAsNotCompleted = false
) => {
  const task = await Task.findByIdAndUpdate(id, newInfoBody, {
    new: true,
    runValidators: true,
  });
  if (task && markAsNotCompleted) {
    task.completedDateTime = undefined;
    await task.save();
  }
};

const deleteTask = async (id: string) => {
  return await Task.findByIdAndRemove(id);
};

export { getTasks, getTaskById, addTask, updateTask, deleteTask };
