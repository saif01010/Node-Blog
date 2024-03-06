import { Blog } from '../models/blog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uplaodOnCloudinary } from '../utils/cloudinary.js';

const createBlog = asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;
    
    if (!(title || content || tags)) {
        throw new ApiError(400, 'All input is required');
    }
    
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, 'Cover image is required');
    }

    console.log(coverImageLocalPath)
    
    const coverImageUrl = await uplaodOnCloudinary(coverImageLocalPath);
    if (!coverImageUrl) {
        throw new ApiError(500, 'Failed to upload cover image');
    }
    console.log(coverImageUrl);

    const author = req.user.fullName;
    console.log(author)
    
    const blog = await Blog.create({
        title,
        content,
        tags,
        coverImage: coverImageUrl,
        author
    });
    if (!blog) {
        throw new ApiError(500, 'Failed to create blog');
    }

    return res.status(201).json(new ApiResponse(201, blog, 'Blog created successfully'));
});

export { createBlog };