import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


const veryfyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer ","");
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        };
        //console.log("Token: ", token);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized");
        };
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        };
        console.log("User: ", user);
        req.user = user;
        next(); 
    } catch (error) {
        console.log("Error in veryfyToken: ", error);
        throw new ApiError(401, "Unauthorized");
    };
});

export { veryfyToken };