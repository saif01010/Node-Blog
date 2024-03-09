import { Router } from "express";
import {createBlog, getBlogs} from "../controllers/blog.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { veryfyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(veryfyToken)

router.route("/create").post(upload.single("coverImage"),createBlog);
router.route("/").get(getBlogs);

export default router;