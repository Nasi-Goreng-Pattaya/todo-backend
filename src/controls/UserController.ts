import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  deleteUser,
  loginUser,
  registerUser,
  updateUser,
} from "../services/UserService";

// @desc Get user data
// @route GET /api/user/me
// @access Private
const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(req.body.user);
  }
);

// @desc Authenticate a user
// @route POST /api/user/login
// @access Public
const tryToLoginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json(user);
  }
);

// @desc Register user
// @route POST /api/user/register
// @access Public
const tryToRegisterUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await registerUser(req.body);
    res.json(user);
  }
);

// @desc Update user
// @route PATCH /api/user/:id
// @access Private
const tryToUpdateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  }
);

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private
const tryToDeleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedUser = await deleteUser(req.params.id);
    res.json(deletedUser);
  }
);

export {
  getUser,
  tryToRegisterUser as registerUser,
  tryToUpdateUser as updateUser,
  tryToDeleteUser as deleteUser,
  tryToLoginUser as loginUser,
};
