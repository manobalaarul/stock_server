import { Router } from "express";
import {
  GetProfileController,
  UpdateProfileController,
} from "../controller/profile.controller.js";
import auth from "../middleware/auth.js";

const profileRouter = Router();

profileRouter.get("/get_profile", auth, GetProfileController);
profileRouter.put("/update_profile", auth, UpdateProfileController);
// profileRouter.delete("/delete", authenticate, DeleteProfileController);

export default profileRouter;

