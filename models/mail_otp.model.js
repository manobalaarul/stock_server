import mongoose from "mongoose";

const mailOtpSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    otp: {
      type: Number,
      default: null,
    },
    expires_in: {
      type: Date,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const MailOtpModel = mongoose.model("mail_otp", mailOtpSchema);
export default MailOtpModel;
