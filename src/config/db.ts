import mongoose from "mongoose";
import colors from "colors";
import env from "../utils/validateEnv";
import app from "../app";

const port = process.env.PORT || 5000;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(
      colors.bgGreen(`MongoDB Connected: ${mongoose.connection.host}`)
    );
    app.listen(port, () =>
      console.log(colors.bgGreen(`Server started on port ${port}`))
    );
  } catch (error) {
    console.error(
      colors.bgRed(`Error connecting to MongoDB: ${(error as Error).message}`)
    );
    process.exit(1);
  }
};

export default connectDB;
