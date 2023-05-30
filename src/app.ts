import express from "express";
import { userRouter } from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import { taskRouter } from "./routes/TaskRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.use(errorHandler);

export default app;
