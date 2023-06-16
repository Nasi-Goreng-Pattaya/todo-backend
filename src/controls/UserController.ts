import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UploadedFile } from "express-fileupload";
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
    const base64String = user.avatar?.toString("base64");

    res.json({ ...user, avatar: base64String });
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
    // if (req.files?.avatar) {
    //   if (!Array.isArray(req.files.avatar)) {
    //     // console.log(req.files.avatar.data);
    //     req.body.avatar = req.files.avatar.data;
    //   }
    // }

    // const file = req.files!.avatar;
    // console.log(typeof file);
    // if (file) {
    //   req.body.avater = file;
    // }
    // req.body.avatar = file.data;

    if (req.body.avatar) {
      const buffer = Buffer.from(req.body.avatar, "base64");
      req.body.avatar = buffer;
    }

    const updatedUser = await updateUser(req.params.id, req.body);

    const updatedUserJson = updatedUser?.toJSON();

    const responseUser = {
      ...updatedUserJson,
      avatar: updatedUser?.avatar?.toString("base64"),
    };

    res.json(responseUser);
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
