import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Generate unique filenames

const uploadImage = async (image, folder) => {
  try {
    // Define the local folder to store images
    const baseUploadFolder = path.join(process.cwd(), "uploads");

    const uploadFolder = path.join(baseUploadFolder, folder);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}_${Date.now()}.jpg`; // Change extension if needed
    const filePath = path.join(uploadFolder, uniqueFilename);

    // Convert image buffer
    const buffer =
      image.buffer ??
      Buffer.from(
        await image.arrayBuffer().catch((err) => {
          console.error("Error converting image to ArrayBuffer:", err);
          throw new Error("Invalid image input.");
        })
      );

    // Write the file to the local directory
    fs.writeFileSync(filePath, buffer);

    // Generate file URL (assuming Express static setup)
    const url = `/uploads/${folder}/${uniqueFilename}`;

    console.log("Upload successful:", url);
    return { filePath, url };
  } catch (error) {
    console.error("Local image upload error:", error);
    throw new Error("Image upload failed.");
  }
};

export default uploadImage;
