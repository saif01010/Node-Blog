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

const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    if (!blogs) {
        throw new ApiError(500, 'Failed to get blogs');
    }

    return res.status(200)
    .json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
});

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params?.id);
    if (!blog) {
        throw new ApiError(404, 'Blog not found');
    }

    return res.status(200)
    .json(new ApiResponse(200, blog, 'Blog fetched successfully'));
});

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const {title,content,tags} = req.body;
    console.log(title,content,tags)
    const blog = await Blog.findByIdAndUpdate(id,{
       $set: {title,
        content,
        tags}
    },{new:true});

    if(!blog){
        throw new ApiError(500,"Failed to update blog");
    }

    return res.status(200).json(new ApiResponse(200,blog,"Blog updated successfully"));
})




export { createBlog, getBlogs, getBlogById,updateBlog};