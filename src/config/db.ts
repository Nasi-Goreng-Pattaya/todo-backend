import mongoose from "mongoose";
import colors from "colors";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(
      colors.bgGreen(`MongoDB Connected: ${mongoose.connection.host}`)
    );
  } catch (error) {
    console.error(
      colors.bgRed(`Error connecting to MongoDB: ${(error as Error).message}`)
    );
    process.exit(1);
  }
};

export default connectDB;
