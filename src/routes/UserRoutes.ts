import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controls/UserController";
import { protect } from "../middlewares/AuthMiddleware";
import { convertAvatarToBufferFormat } from "../middlewares/AvatarBufferConverterMiddleware";
import { hashPassword } from "../middlewares/HashPasswordMiddleware";

export const userRouter = express.Router();

userRouter.post(
  "/register",
  hashPassword,
  convertAvatarToBufferFormat,
  registerUser
);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getUser);
userRouter.route("/:id").patch(updateUser).delete(deleteUser);
