import ProductModel from "../models/product.model.js";
import InStockModel from "../models/instock.model.js";

export const AddStockController = async (request, response) => {
  try {
    const { productId, qty, seller_name, seller_phone } = request.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    product.stock += parseInt(qty, 10);
    await product.save();

    const newStock = new InStockModel({
      productId,
      seller_name: seller_name,
      seller_phone: seller_phone,
      quantity: qty,
      date: new Date(),
    });

    await newStock.save(); // ✅ FIX: Await the save operation

    return response.json({
      message: "Stock added successfully",
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
};

export const GetStockController = async (request, response) => {
  try {
    let { page, limit } = request.body;

    // Set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const [movements, totalCount] = await Promise.all([
      InStockModel.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId"),
      InStockModel.countDocuments(),
    ]);

    return response.json({
      message: "Stock Details",
      data: movements,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page,
      limit,
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
};
