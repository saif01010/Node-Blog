import mongoose,{Schema} from "mongoose";

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
        
    },
    content:{
        type:String,
        required:true,
        
    },
    author:{
        type:Schema.Types.String,
        ref:"User",
        required:true
    },
    coverImage:{
        type:String,
        
    },
    tags:[{
        type:String,
        
    }]
},{timestamps:true});


export const Blog = mongoose.model("Blog",blogSchema);