import { Router } from "express";
import {
  fetchUserController,
  forgotPasswordController,
  GetAllUserController,
  loginController,
  logoutController,
  refreshToken,
  registerController,
  resetPasswordController,
  SetUserController,
  uploadAvatar,
  uploadUserDetails,
  verifyEmailController,
  verifyForgotPassword,
} from "../controller/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import admin from "../middleware/vendor.js";

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/verify_email", verifyEmailController);
userRouter.get("/fetch_user_details", auth, fetchUserController);
userRouter.put("/update_user_details", auth, uploadUserDetails);
userRouter.put("/upload_avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.get("/logout", auth, logoutController);
userRouter.post("/forgot_password", forgotPasswordController);
userRouter.post("/verify_password", verifyForgotPassword);
userRouter.post("/reset_password", resetPasswordController);
userRouter.post("/refresh_token", refreshToken);
userRouter.get("/all_users", auth, admin, GetAllUserController);
userRouter.post("/set_user", auth, admin, SetUserController);

export default userRouter;
