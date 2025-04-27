import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/vendor.js";
import {
  AddSubCategoryController,
  DeleteSubCategoryController,
  GetSubCategoryController,
  UpdateSubCategoryController,
} from "../controller/subcategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post(
  "/add_subcategory",
  auth,
  admin,
  AddSubCategoryController
);
subCategoryRouter.get("/get_subcategory", GetSubCategoryController);
subCategoryRouter.put(
  "/update_subcategory",
  auth,
  admin,
  UpdateSubCategoryController
);
subCategoryRouter.delete(
  "/delete_subcategory",
  auth,
  admin,
  DeleteSubCategoryController
);
export default subCategoryRouter;
