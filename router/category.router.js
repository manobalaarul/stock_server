import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/vendor.js";
import {
  AddCategoryController,
  DeleteCategoryController,
  GetCategoryController,
  UpdateCategoryController,
} from "../controller/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/add_category", auth, admin, AddCategoryController);
categoryRouter.get("/get_category", GetCategoryController);
categoryRouter.put("/update_category", auth, admin, UpdateCategoryController);
categoryRouter.delete(
  "/delete_category",
  auth,
  admin,
  DeleteCategoryController
);

export default categoryRouter;
