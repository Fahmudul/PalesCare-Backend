import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  password_reset_token: process.env.PASSWORD_RESET_TOKEN,
  password_reset_token_expires_in: process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN,
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  nodemailer_user: process.env.GMAIL_ACCOUNT,
  nodemailer_pass: process.env.GOOGLE_APP_PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_api_key: process.env.CLOUDINARY_API_KEY,
  cloud_api_secret: process.env.CLOUDINARY_API_SECRET,
};
