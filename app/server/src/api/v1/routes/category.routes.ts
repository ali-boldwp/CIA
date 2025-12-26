import { Router } from "express";
import * as categoryController from "../controllers/category.controller"
import { auth } from "../../../middlewares/auth.middleware";



const router = Router();

router.post("/", auth, categoryController.createCategory);
router.get("/", auth, categoryController.getAllCategory);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

router.get("/projects/:projectId/form-data", auth, categoryController.getProjectFormData);
router.get("/:id/tree", auth, categoryController.getCategoryTree);


router.put(
    "/:id/update-index",
    auth,
    categoryController.reorderCategoryTree
);


router.get("/:id", auth, categoryController.getCategoryById);



export default router;
