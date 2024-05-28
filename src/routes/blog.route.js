import { Router } from "express";
import {createBlog, getBlogs, getBlogById, updateBlog} from "../controllers/blog.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { veryfyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(veryfyToken)

router.route("/create").post(upload.single("coverImage"),createBlog);
router.route("/").get(getBlogs);


router.route("/:id").get(veryfyToken,getBlogById).post(veryfyToken,updateBlog);

export default router;