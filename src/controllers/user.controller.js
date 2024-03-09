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

const logoutUser = asyncHandler(async(req,res)=>{

    res.clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200,{},"User logged out successfully"));
});

const editProfile = asyncHandler(async(req,res)=>{
    const {fullName,username} = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId,{
        $set:{
            fullName,
            username
        }
    },{new:true});

    if(!user){
        throw new ApiError(500,"Failed to update user");
    };

    return res.status(200)
    .json(new ApiResponse(200,user,"User updated successfully"));
});

const getCurrentUser = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    // const user = await User.findById(userId).select("-password -refreshToken");
    const user = await User.aggregate([
        { 
        $match: {
         _id: userId 
        }
    },
    {
        $lookup: {
            from: "blogs",
            localField: "_id",
            foreignField: "author",
            as: "posts"
        }
    },
    {
        $addFields: {
            totalPosts: { $size: "$posts"},
            posts: { $slice: ["$posts", 5]}
        }
    },
    {   $project: { 

            totalPosts: 1,
            posts: 1,
            fullName: 1,
            email: 1,
        }
    }]);
    if(!user){
        throw new ApiError(500,"Failed to get user");
    };
    return res.status(200)
    .json(new ApiResponse(200,user,"User retrieved successfully"));
});

const deleteAccount = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId);
    if(!user){
        throw new ApiError(500,"Failed to delete user");
    };
    return res.status(200).json(new ApiResponse(200,{},"User deleted successfully"));
});

export {registerUser,loginUser,logoutUser,editProfile,deleteAccount,getCurrentUser};