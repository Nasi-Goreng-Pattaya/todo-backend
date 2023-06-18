import dotenv from "dotenv";
import connectDB from "./config/db";
import express from "express";
import { userRouter } from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import { taskRouter } from "./routes/TaskRoutes";
import colors from "colors";
import cors from "cors";
import { reminderRouter } from "./routes/ScheduleRoutes";
import fileUpload from "express-fileupload";
import schedule from "./services/ScheduleService";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/reminder", reminderRouter);

app.use(errorHandler);

app.listen(port, async () => {
  console.log(colors.bgGreen(`Server started on port ${port}`));
  await connectDB();
  schedule.reSchedule();
});
