import ProfileModel from "../models/profile.model.js";

export async function GetProfileController(request, response) {
  try {
    const userId = request.userId;

    const profile = await ProfileModel.findOne({ userId });
    if (!profile) {
      return response.status(404).json({
        message: "Profile not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Profile retrieved successfully",
      data: profile,
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

export async function UpdateProfileController(request, response) {
  try {
    const { company_name, address, phone, gstNo, gstPer } = request.body;
    const userId = request.userId;

    if (!company_name || !address || !phone) {
      return response.status(400).json({
        message: "Company name, address, and phone are required",
        error: true,
        success: false,
      });
    }

    const existingProfile = await ProfileModel.findOne({ userId });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await ProfileModel.findOneAndUpdate(
        { userId },
        {
          company_name,
          address,
          phone,
          gstNo: gstNo || existingProfile.gstNo,
          gstPer: gstPer || existingProfile.gstPer,
        },
        { new: true }
      );

      return response.json({
        message: "Profile updated successfully",
        data: updatedProfile,
        error: false,
        success: true,
      });
    } else {
      // Create new profile
      const newProfile = new ProfileModel({
        userId,
        company_name,
        address,
        phone,
        gstNo: gstNo || "",
        gstPer: gstPer || 0,
        date: new Date(),
      });

      const savedProfile = await newProfile.save();

      return response.status(201).json({
        message: "Profile created successfully",
        data: savedProfile,
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// export async function DeleteProfileController(request, response) {
//   try {
//     const userId = request.user?._id;

//     const existingProfile = await ProfileModel.findOne({ userId });
//     if (!existingProfile) {
//       return response.status(404).json({
//         message: "Profile not found",
//         error: true,
//         success: false,
//       });
//     }

//     // Check if profile is being used anywhere before deletion
//     // Add any necessary checks here based on your application logic

//     await ProfileModel.deleteOne({ userId });

//     return response.json({
//       message: "Profile deleted successfully",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }
