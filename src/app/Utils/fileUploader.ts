import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import Config from "../Config";
import { CustomError } from "../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "Uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const cloudinaryImageUploader = async function (
  imagePath: string,
  imageName: string
) {
  // Configuration
  try {
    cloudinary.config({
      cloud_name: Config.cloud_name,
      api_key: Config.cloud_api_key, // Click 'View API Keys' above to copy your API key
      api_secret: Config.cloud_api_secret, // Click 'View API Keys' above to copy your API secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(imagePath, {
        public_id: imageName, // The name of the image in your Cloudinary account
      })
      .catch((error) => {
        console.log(error);
      });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url("shoes", {
      fetch_format: "auto",
      quality: "auto",
    });
    if (uploadResult) {
      fs.unlinkSync(imagePath); // Delete the image from the local file system
    }
    return uploadResult;
  } catch (error) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Image upload failed"
    );
  }
};
export const fileUploader = {
  upload: multer({ storage: storage }),
  cloudinaryImageUploader,
};
