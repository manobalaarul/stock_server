import UserModel from "../models/user.model.js";

const admin = async (request, response, next) => {
  try {
    const userId = request.userId;
    const user = await UserModel.findById(userId);
    if (user.role !== "VENDOR") {
      response.status(200).json({
        message: "Permission Denied",
        error: true,
        success: false,
      });
    }
    next();
  } catch (error) {
    response.status(500).json({
      message: "Permission Denied",
      error: true,
      success: false,
    });
  }
};

export default admin;
