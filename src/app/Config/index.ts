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
  sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
  sslcommerz_store_pass: process.env.SSLCOMMERZ_STORE_PASS,
  success_url: process.env.SUCCESS_URL,
  failed_url: process.env.FAILED_URL,
  cancel_url: process.env.CANCEL_URL,
  ssl_payment_api: process.env.SSL_PAYMENT_API,
  ssl_validation_api: process.env.SSL_VALIDATION_API,
};
