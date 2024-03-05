import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";
dotenv.config();
const connectDB = asyncHandler(async () => {
    console.log("DB_URL", process.env.DB_URL)
    try {
        const conncet = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
        console.log(`Database connected: ${conncet.connection.name}`);
    } catch (error) {
        console.log(error, "Database connection failed");
        process.exit(1);
    }
});

export {connectDB};