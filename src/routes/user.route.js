import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUser).get((req,res)=>{
    res.render("register");
});


export default router;