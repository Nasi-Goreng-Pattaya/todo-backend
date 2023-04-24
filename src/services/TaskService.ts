import Task from '../models/TaskModel'

const getTasks = async (userId: string) => {
    const tasks = await Task.find({ userId })
    return tasks
}

const addTask = async (taskBody: Object, userId: string) => {
    const task = await Task.create({ ...taskBody, userId })
    return task
}

const updateTask = async (id: string, newInfoBody: Object) => {
    return await Task.findByIdAndUpdate(id, newInfoBody, { new: true })
}

const deleteTask = async (id: string) => {
    return await Task.findByIdAndRemove(id)
}

export {
    getTasks,
    addTask,
    updateTask,
    deleteTask
}
