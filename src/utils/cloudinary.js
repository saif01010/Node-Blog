import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uplaodOnCloudinary = async(localPath)=>{
    if(!localPath) return null;

   try {
     const response = await cloudinary.uploader.upload(localPath,{resource_type:"auto"});
     console.log(response.url);

     fs.unlinkSync(localPath);
     return response.url;  

   } catch (error) {
        fs.unlinkSync(localPath);
        return null;
   };
};

export{uplaodOnCloudinary}