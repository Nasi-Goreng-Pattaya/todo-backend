import dotenv from "dotenv";
import connectDB from "./config/db";
import express from "express";
import { userRouter } from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import { taskRouter } from "./routes/TaskRoutes";
import colors from "colors";
import cors from "cors";
import { reminderRouter } from "./routes/ScheduleRoutes";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/reminder", reminderRouter);

app.use(errorHandler);

app.listen(port, () =>
  console.log(colors.bgGreen(`Server started on port ${port}`))
);
