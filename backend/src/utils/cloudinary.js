import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         //console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath)
//         return response;

//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }

// export {uploadOnCloudinary}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary with public access
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Ensures it handles images, PDFs, videos, etc.
      type: "upload", // Ensures it's publicly accessible
      access_mode: "public", // Explicitly set to public
    });

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove local file if upload fails
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

const makeFilePublic = async (publicId) => {
  try {
    const response = await cloudinary.api.update(publicId, {
      access_mode: "public",
    });
    console.log("File access mode updated to public:", response);
  } catch (error) {
    console.error("Error updating file access mode:", error);
  }
};

export { uploadOnCloudinary };
