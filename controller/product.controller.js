import ProductModel from "../models/product.model.js";

export const AddProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      sub_category,
      unit,
      bar_code,
      actual_price,
      selling_price,
      description,
      publish,
    } = request.body;

    if (
      (!name ||
        !image[0] ||
        !category[0] ||
        !sub_category[0] ||
        !unit ||
        !bar_code ||
        !actual_price||
      !selling_price||
      !description || !publish)
    ) {
      return response.status(200).json({
        message: "Enter required details",
        error: true,
        success: false,
      });
    }
    var new_pub;
    if (publish == 1) {
      new_pub = true;
    } else {
      new_pub = false;
    }
    const product = new ProductModel({
      name,
      image,
      category,
      sub_category,
      unit,
      actual_price,
      selling_price,
      bar_code,
      description,
      publish: new_pub,
    });

    const saveProduct = await product.save();

    return response.status(201).json({
      message: "Product added successfully",
      error: false,
      success: true,
      data: saveProduct,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductController = async (request, response) => {
  try {
    let { page, limit } = request.body;
    if (!page) {
      page = 2;
    }
    if (!limit) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category sub_category"),
    ]);

    return response.json({
      message: "Products data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductByCategoryController = async (request, response) => {
  try {
    const { categoryId } = request.body;

    if (!categoryId) {
      return response.status(200).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.find({
      category: { $in: categoryId },
    })
      .limit(15)
      .populate("category sub_category");

    return response.json({
      message: "Category product list",
      data: product,
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

export const GetProductByCategoryAndSubCategoryController = async (
  request,
  response
) => {
  try {
    let { categoryId, subCategoryId, page, limit } = request.body;

    if (!categoryId || !subCategoryId) {
      return response.status(200).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    page = page || 1;
    limit = limit || 10;

    const query = {
      category: { $in: Array.isArray(categoryId) ? categoryId : [categoryId] },
      sub_category: {
        $in: Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId],
      },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category sub_category"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product List",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const GetProductDetailsController = async (request, response) => {
  try {
    const { productId } = request.body;
    const product = await ProductModel.findOne({ _id: productId }).populate(
      "category sub_category"
    );

    return response.json({
      message: "Product Details",
      data: product,
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

// update product
export const UpdateProductDetailsController = async (request, response) => {
  try {
    const { _id } = request.body;
    if (!_id) {
      return response.status(200).json({
        message: "Provide product _id",
        error: true,
        success: false,
      });
    }
    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...request.body,
      }
    );

    return response.json({
      message: "Updated Successfully",
      data: updateProduct,
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

export const DeleteProductDetailsController = async (request, response) => {
  try {
    const { _id } = request.body;
    if (!_id) {
      response.status(200).json({
        message: "Provide _id of an product",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return response.json({
      message: "Product deleted successfully",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    response.status(500).json({
      message: "Permission Denied",
      error: true,
      success: false,
    });
  }
};

//search product
export const SearchProductController = async (request, response) => {
  try {
    let { search, page, limit } = request.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 12;
    }

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Search in name
            { description: { $regex: search, $options: "i" } }, // Search in description
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category sub_category"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const SearchProductNameController = async (request, response) => {
  try {
    const { search, bar_code } = request.body;

    // No input provided
    if (!search && !bar_code) {
      return response.status(400).json({
        message: "Either barcode or search text is required",
        error: true,
        success: false,
      });
    }

    // Build dynamic query based on input
    let query = {};

    if (bar_code) {
      query = {
        bar_code: { $regex: bar_code, $options: "i" }, // barcode match
      };
    } else if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const data = await ProductModel.find(query)
      .select("name _id stock actual_price selling_price") // only send what you need
      .limit(10); // can be removed if you want everything

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

