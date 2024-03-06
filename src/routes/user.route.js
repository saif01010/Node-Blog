import { Router } from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";



const router = Router();

router.route("/register").post(upload.single("profilePic"),registerUser).get(async (req,res)=>{
    res.render("register")
});
router.route("/login").get(loginUser);


export default router;