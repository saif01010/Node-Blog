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

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


//Routes
import userRoute from './routes/user.route.js';

app.use("/users",userRoute);


export {app};