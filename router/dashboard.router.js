import { Router } from "express";
import { DashboardDataController } from "../controller/dashboard.controller.js";
import auth from "../middleware/auth.js";

const dashboardRouter = Router();

dashboardRouter.get("/todays_report", auth, DashboardDataController);

export default dashboardRouter;
