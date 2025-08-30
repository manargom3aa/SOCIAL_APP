import  { connect } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
  

 

    const result = await connect(  process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(result.models);
    console.log("DB connected ✅");
  } catch (error) {
    console.error("Fail to connect on DB❌ ");
  }
};

export default connectDB;
