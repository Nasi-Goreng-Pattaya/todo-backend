import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    priority: String,
    hasReminder: Boolean,
    reminderDateTime: {
        type: Date,
        default: null,
        required: false,
    },
    createdDateTime: {
        type: Date,
        default: Date.now,
    },
    title: String,
    progess: Number,
    category: String,
    dueDateTime: Date,
    isCompleted: Boolean,
    completedDateTime: {
        type: Date,
        default: null,
        required: false,
    }

});

const Task = mongoose.model("TodoTask", TaskSchema);

export default Task;