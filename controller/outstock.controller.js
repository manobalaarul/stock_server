import OutStockModel from "../models/outstock.model.js";

export const GetOutStockController = async (request, response) => {
  try {
    let { page, limit } = request.body;

    // Set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const [movements, totalCount] = await Promise.all([
      OutStockModel.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId"),
      OutStockModel.countDocuments(),
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
