import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';


const app = express();

app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        credentials:true
    }

));

app.use(cookieParser());

app.use(express.json({limit:"30mb",extended:true}));
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

//Routes
import userRoute from './routes/user.route.js';
import blogRoute from './routes/blog.route.js';
app.use("/users",userRoute);
app.use("/blogs",blogRoute);

export {app};