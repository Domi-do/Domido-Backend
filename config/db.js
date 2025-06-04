import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      autoIndex: true,
      bufferCommands: true,
    });
    console.log("mongoDB 연결 완료");
  } catch (error) {
    console.error("mongoDB 연결 실패", error);
    process.exit(1);
  }
};

export default connectDB;
