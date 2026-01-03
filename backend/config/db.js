import mongoose from "mongoose";
export const connectDB = async () => {
  console.log("Connecting to MongoDB...", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
