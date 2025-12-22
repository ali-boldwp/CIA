import { Router } from "express";
import * as categoryController from "../controllers/category.controller"
import { auth } from "../../../middlewares/auth.middleware";


const router = Router();

router.post("/", auth, categoryController.createCategory);

router.get("/", auth, categoryController.getAllCategory);

router.put("/:id", auth, categoryController.updateCategory);


export default router;
