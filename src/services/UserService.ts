import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (
    user &&
    user.password &&
    (await bcrypt.compare(password, user.password))
  ) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      birthDate: user.birthDate,
      avatar: user.avatar,
      token: generateToken(user.id),
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

const registerUser = async (userBody: Object) => {
  const user = await User.create(userBody);
  const token = generateToken(user.id);

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

const updateUser = async (id: string, newInfoBody: Object) => {
  return await User.findByIdAndUpdate(id, newInfoBody, {
    new: true,
  }).select("-password");
  // const base64String = user?.avatar?.toString("base64");
  // if(user?.avatar) {
  //   user.avatar = base64String;
  // }
  // console.log(user);
  // return { ...user, avatar: base64String };
};

const deleteUser = async (id: string) => {
  return await User.findByIdAndRemove(id).select("-password");
};

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, <Secret>process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export { loginUser, registerUser, updateUser, deleteUser };
