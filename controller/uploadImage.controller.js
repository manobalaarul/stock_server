import uploadImage from "../utils/uploadImage.js";

const uploadImageController = async (request, response) => {
  try {
    const file = request.file;
    const { folder } = request.body;
    const imageData = await uploadImage(file, folder);
    return response.json({
      message: "Image Uploaded",
      data: imageData,
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

export default uploadImageController;
