import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
export const verifyCloudinaryConfig = (): boolean => {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.warn('⚠️ Cloudinary not configured. Image uploads will fail.');
    return false;
  }
  console.log('✅ Cloudinary configured successfully');
  return true;
};

export default cloudinary;
