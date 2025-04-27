import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import MailOtpModel from "../models/mail_otp.model.js";
import forgotPasswordOtpTemplate from "../utils/forgotPasswordOtpTemplate.js";
import uploadImage from "../utils/uploadImage.js";
import jwt from "jsonwebtoken";

export async function registerController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(200).json({
        message: "Provide email,name and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return response.status(200).json({
        message: "Email already exist",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();

    const verifyEmail = `${process.env.FRONTEND_URL}/auth/verify_email?code=${savedUser?._id}`;

    const sendVerifyEmail = await sendEmail({
      sendTo: email,
      subject: "Email Verification form Stock Management",
      html: verifyEmailTemplate({
        name: name,
        url: verifyEmail,
      }),
    });

    return response.status(200).json({
      message: "User Registered Successfully",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return response.status(200).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return response.json({
      message: "Email verification successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(200).json({
        message: "Email and Password are required",
        error: true,
        success: false,
      });
    }

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return response.status(200).json({
        message: "Email address not found",
        error: true,
        success: false,
      });
    }

    if (findUser.status !== "Active") {
      return response.status(200).json({
        message: "Contact admin!..",
        error: true,
        success: false,
      });
    }

    if (!findUser.verify_email) {
      return response.status(200).json({
        message: "Verify your email address",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, findUser.password);
    if (!checkPassword) {
      return response.status(200).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }
    const accessToken = await generateAccessToken(findUser._id);
    const refreshToken = await generateRefreshToken(findUser._id);

    const updateUser = await UserModel.findByIdAndUpdate(findUser._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    response.cookie("accessToken", accessToken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.json({
      message: "Login Successfull",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function fetchUserController(request, response) {
  try {
    const userId = request.userId;
    const user = await UserModel.findById(userId).select(
      "-password -refresh-token"
    );
    return response.json({
      message: "User Details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userId = request.userId; // from middeleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return response.json({
      message: "Logout Successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(200).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;

    const expireTime = new Date().getTime() + 60 * 60 * 1000; // 1hr
    const payload = {
      userId: user._id,
      otp: otp,
      expires_in: expireTime,
    };
    const insertOtp = new MailOtpModel(payload);
    const saveOtp = await insertOtp.save();
    const sendVerifyEmail = await sendEmail({
      sendTo: email,
      subject: "Otp for reset password",
      html: forgotPasswordOtpTemplate({ name: user.name, otp: otp }),
    });
    return response.json({
      message: "Otp has been sent to your mail",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPassword(request, response) {
  try {
    const { email, otp } = request.body;
    if (!email || !otp) {
      return response.status(200).json({
        message: "Please enter email and otp",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(200).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }
    const getOtp = await MailOtpModel.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });
    const currentTime = new Date();

    if (getOtp.expires_in < currentTime) {
      return response.status(200).json({
        message: "Otp is expired",
        error: true,
        success: false,
      });
    }
    console.log(getOtp.otp);

    if (otp.toString() !== getOtp.otp.toString()) {
      return response.status(200).json({
        message: "Enter correct Otp",
        error: true,
        success: false,
      });
    }

    // const updateUser = await MailOtpModel.deleteOne({ userId: user?._id });

    return response.json({
      message: "Verification Successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetPasswordController(request, response) {
  try {
    const { email, password, confirm_password } = request.body;

    if (!email || !password || !confirm_password) {
      return response.status(200).json({
        message: "Please enter email and passwords",
        error: true,
        success: false,
      });
    }
    if (password !== confirm_password) {
      return response.status(200).json({
        message: "Password and confirm password does not match",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(200).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const update = await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });

    return response.json({
      message: "Password updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId;
    const image = request.file;

    const upload = await uploadImage(image, "profile");

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return response.json({
      message: "Profile Updated",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadUserDetails(request, response) {
  try {
    const userId = request.userId;
    const { name, email, phone } = request.body;

    // Check if email already exists (excluding the current user)
    if (email) {
      const existingUser = await UserModel.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return response.status(200).json({
          message: "Email already in use",
          error: true,
          success: false,
        });
      }
    }

    // Proceed with updating user details
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        name: name ?? "", // If `name` is undefined or null, store an empty string
        email: email ?? "",
        mobile: phone ?? "",
        gstNo: gstNo ?? "",
      }
    );

    return response.json({
      message: "User details updated",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorization?.split(" ")[1]; //

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false,
      });
    }

    console.log("refreshToken", refreshToken);

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return response.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }
    console.log("Verify Token", verifyToken);

    const userId = verifyToken?._id;

    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.json({
      message: "New access token generated",
      error: true,
      success: false,
      data: {
        accesstoken: newAccessToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function GetAllUserController(request, response) {
  try {
    const allusers = await UserModel.find();

    return response.json({
      message: "User details",
      error: false,
      success: true,
      data: allusers,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function SetUserController(request, response) {
  try {
    const { _id, status } = request.body;
    const user = await UserModel.find({ _id: _id });
    if (!user) {
      return response.status(200).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    let updateUser;
    if (status === "Active") {
      updateUser = await UserModel.findOneAndUpdate(
        { _id: _id },
        { status: "Inactive" }
      );
    } else {
      updateUser = await UserModel.findOneAndUpdate(
        { _id: _id },
        { status: "Active" }
      );
    }
    return response.json({
      message: "User status updated",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
