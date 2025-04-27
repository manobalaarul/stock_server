import express from "express";
import {
  CancelOrderController,
  ConfirmOrderController,
  GetOrderController,
  GetOrderDetailController,
  ReturnOrderController,
  SaveOrderController,
  UpdateSavedOrderController,
} from "../controller/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/save_order", SaveOrderController);
orderRouter.post("/update_order", UpdateSavedOrderController);
orderRouter.get("/get_order", GetOrderController);
orderRouter.post("/get_order_detail", GetOrderDetailController);
orderRouter.post("/confirm_order", ConfirmOrderController);
orderRouter.post("/cancel_order", CancelOrderController);
orderRouter.post("/return_order", ReturnOrderController);

export default orderRouter;
