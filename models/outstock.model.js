import mongoose, { Mongoose } from "mongoose";

const outStockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "orders",
    },
    quantity: {
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

const OutStockModel = mongoose.model("outstock", outStockSchema);
export default OutStockModel;
