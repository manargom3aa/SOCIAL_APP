import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri: string | undefined = process.env.DB_URI;

    if (!uri) {
      throw new Error("DB_URI is not defined in environment variables");
    }

    const result = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    } as ConnectOptions);

    console.log(result.models);
    console.log("DB connected ✅");
  } catch (error: any) {
    console.error("Fail to connect on DB❌ ", error.message);
  }
};

export default connectDB;
