import nodemailer from "nodemailer";
import Config from "../Config";

export const sendMail = async (payload: any): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: Config.nodemailer_user,
      pass: Config.nodemailer_pass,
    },
  });

  const mailOptions = {
    from: "Pales Care",
    to: payload.email,
    subject: payload.subject,
    html: `<a href="${payload.link}" target="_blank">click here to reset your password</a>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};
