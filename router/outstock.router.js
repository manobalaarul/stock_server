import { Router } from "express";
import auth from "../middleware/auth.js";
import { GetOutStockController } from "../controller/outstock.controller.js";

const outStockRouter = Router();

outStockRouter.get("/get_outstock", auth, GetOutStockController);

export default outStockRouter;
