import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { DB_NAME } from "../constant.js";
const connectDB = asyncHandler(async () => {
    try {
        const conncet = await mongoose.connect(`process.env.DB_URL/${DB_NAME}`)
    } catch (error) {
        console.log(error, "Database connection failed");
    }
})