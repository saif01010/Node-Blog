import {User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uplaodOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async(req,res,next)=>{
    const {fullName,email,username,password,profilePic} = req.body;
    console.log(req.body);
    if(!(username || email || password)){
        throw new ApiError(400,"All input is required");
    };
    // const profileImageLocalPath = req.file?.path;
    // if(!profileImageLocalPath){
    //     throw new ApiError(400,"Profile image is required");
    // }
    // const profileImageUrl = await uplaodOnCloudinary(profileImageLocalPath);
    // if(!profileImageUrl){
    //     throw new ApiError(500,"Failed to upload profile image");
    // }
    const user = await User.create({
        fullName,
        email,
        username,
        password,
        profilePic
   })
    if(!user){
         throw new ApiError(500,"Failed to create user");
    }
    return res.status(201)
    .json(new ApiResponse(201,user,"User created successfully"));
});

export {registerUser};