import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/vendor.js";
import {
  AddProductController,
  DeleteProductDetailsController,
  GetProductByCategoryAndSubCategoryController,
  GetProductByCategoryController,
  GetProductController,
  GetProductDetailsController,
  SearchProductController,
  SearchProductNameController,
  UpdateProductDetailsController,
} from "../controller/product.controller.js";

const productRouter = Router();

productRouter.post("/add_product", auth, admin, AddProductController);
productRouter.post("/get_product", GetProductController);
productRouter.post("/get_by_category", GetProductByCategoryController);
productRouter.post(
  "/get_by_category_subcategory",
  GetProductByCategoryAndSubCategoryController
);
productRouter.post("/get_product_details", GetProductDetailsController);
productRouter.put(
  "/update_product",
  auth,
  admin,
  UpdateProductDetailsController
);
productRouter.delete(
  "/delete_product",
  auth,
  admin,
  DeleteProductDetailsController
);
productRouter.post("/search_product", SearchProductController);
productRouter.post("/search_product_name", SearchProductNameController);

export default productRouter;
