import CategoryModel from "../models/category.model.js";
import path from "path";
import fs from "fs";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subcategory.model.js";

export async function AddCategoryController(request, response) {
  try {
    const { image, name } = request.body;
    if (!name || !image) {
      return response.status(200).json({
        message: "Enter name and image",
        error: true,
        success: false,
      });
    }

    const newCategory = new CategoryModel({
      name: name,
      image: image,
    });

    const saveCategory = await newCategory.save();

    if (!saveCategory) {
      return response.status(200).json({
        message: "Category not saved",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Category added successfully",
      data: saveCategory,
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

export async function GetCategoryController(request, response) {
  try {
    const data = await CategoryModel.find().sort({ createdAt: -1 });
    return response.json({
      message: "Categories",
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

export async function UpdateCategoryController(request, response) {
  try {
    const { _id, name, image } = request.body;
    const existingCategory = await CategoryModel.findById(_id);
    if (!existingCategory) {
      return response.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    if (image !== existingCategory.image) {
      const imagePath = path.join(process.cwd(), existingCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Old image deleted:", existingCategory.image);
      }
    }

    const update = await CategoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
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

export async function DeleteCategoryController(request, response) {
  try {
    const { _id } = request.body;
    const checkSubCate = await SubCategoryModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();
    const checkProduct = await ProductModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkSubCate > 0 || checkProduct > 0) {
      return response.status(200).json({
        message: "Category already in use can't be deleted",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({ _id: _id });
    return response.json({
      message: "Category deleted",
      data: deleteCategory,
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
