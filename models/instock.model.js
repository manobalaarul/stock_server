import mongoose, { Mongoose } from "mongoose";

const inStockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
    },
    seller_name: {
      type: String,
      default: "",
    },
    seller_phone: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: null,
    },
    quantity: {
      type: Number,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const InStockModel = mongoose.model("instock", inStockSchema);
export default InStockModel;
