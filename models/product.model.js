import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "categories",
      },
    ],
    sub_category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "sub_categories",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    actual_price: {
      type: Number,
      default: null,
    },
    selling_price: {
      type: Number,
      default: null,
    },
    bar_code: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  {
    name: "text",
    description: "text",
    bar_code: "text",
  },
  {
    weights: {
      name: 10,
      description: 5,
      bar_code: 5,
    },
  }
);

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
