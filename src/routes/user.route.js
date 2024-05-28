import { Router } from "express";
import { registerUser,loginUser,
    editProfile,deleteAccount,
    getCurrentUser, 
    getAllUsers,
    logoutUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {veryfyToken} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePic"),registerUser);
router.route("/get-all-users").get(getAllUsers);
router.route("/login").get(loginUser);
router.route("/edit").put(veryfyToken,editProfile);
router.route("/delete").delete(veryfyToken,deleteAccount);
router.route("/myself").get(veryfyToken,getCurrentUser);
router.route("/logout").get(veryfyToken,logoutUser);

export default router;