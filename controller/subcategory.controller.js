import path from "path";
import fs from "fs";
import SubCategoryModel from "../models/subcategory.model.js";
import ProductModel from "../models/product.model.js";

export async function AddSubCategoryController(request, response) {
  try {
    const { image, name, category } = request.body;
    if (!name || !image || !category) {
      return response.status(200).json({
        message: "Enter name and image",
        error: true,
        success: false,
      });
    }

    const newSubCategory = new SubCategoryModel({
      name: name,
      image: image,
      category: category,
    });

    const saveSubCategory = await newSubCategory.save();

    if (!saveSubCategory) {
      return response.status(200).json({
        message: "Sub Category not saved",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Sub Category added successfully",
      data: saveSubCategory,
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

export async function GetSubCategoryController(request, response) {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return response.json({
      message: "Sub Categories",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UpdateSubCategoryController(request, response) {
  try {
    const { _id, name, image, category } = request.body;
    const existingSubCategory = await SubCategoryModel.findById(_id);
    if (!existingSubCategory) {
      return response.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    if (image && existingSubCategory.image) {
      const imagePath = path.join(process.cwd(), existingSubCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Old image deleted:", existingSubCategory.image);
      }
    }

    const update = await SubCategoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
        category,
      }
    );
    return response.json({
      message: "Update Successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function DeleteSubCategoryController(request, response) {
  try {
    const { _id } = request.body;
    const checkProduct = await ProductModel.find({
      sub_category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkProduct > 0) {
      return response.status(200).json({
        message: "Sub Category already in use can't be deleted",
        error: true,
        success: false,
      });
    }
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);
    return response.json({
      message: "Sub Category deleted",
      data: deleteSub,
      error: false,
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
