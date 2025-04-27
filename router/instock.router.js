import { Router } from "express";
import auth from "../middleware/auth.js";

import {
  AddStockController,
  GetStockController,
} from "../controller/instock.controller.js";

const inStockRouter = Router();

inStockRouter.post("/add_stock", auth, AddStockController);
inStockRouter.get("/get_stock", auth, GetStockController);

export default inStockRouter;
