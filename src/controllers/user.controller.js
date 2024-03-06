import {User } from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uplaodOnCloudinary} from "../utils/cloudinary.js";

const generateTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateresfreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        console.log("Error in generateTokens: ",error);
        throw new ApiError(500,"Failed to generate tokens");
        
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {fullName,email,username,password} = req.body;

    console.log("req.body: ",fullName,email,username,password);

    if(!(username || email || password)){
        throw new ApiError(400,"All input is required");
    };

    const existingUser = await User.findOne({$or:[{email},{username}]});
    if(existingUser){
        throw new ApiError(400,"User already exists");
    };

    const profileImageLocalPath = req.file?.path;
    if(!profileImageLocalPath){
        throw new ApiError(400,"Profile image is required");
    };

    const profileImageUrl = await uplaodOnCloudinary(profileImageLocalPath);
    if(!profileImageUrl){
        throw new ApiError(500,"Failed to upload profile image");
    };

    const user = await User.create({
        fullName,
        email,
        username,
        password,
        profilePic: profileImageUrl
   });

    if(!user){
         throw new ApiError(500,"Failed to create user");
    };

    return res.status(201)
    .json(new ApiResponse(201,user,"User created successfully"));
});

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!(email || password)){
        throw new ApiError(400,"All input is required");
    };

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400,"User does not exist");
    };

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password");
    };

    const {accessToken,refreshToken} = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly:true,
        secure:true

    }

    res.status(200)
    .cookie("refreshToken",refreshToken,option)
    .cookie("accessToken",accessToken,option)
    .json(new ApiResponse(200,loggedInUser,"User logged in successfully"));
})

export {registerUser,loginUser};