import mongoose, { Mongoose } from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    company_name: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: 1,
    },
    gstNo: {
      type: String,
      default: "",
    },
    gstPer: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ProfileModel = mongoose.model("profile", profileSchema);
export default ProfileModel;
