import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secret: string) =>
  jwt.verify(token, secret);

export const generateJWTToken = (
  payload: object | null,
  secret: string,
  expiresIn: string
) => {
  expiresIn = expiresIn || "1h";
  console.log(expiresIn); // Default to 1 hour if not provided
  const token = jwt.sign(payload!, secret, {
    expiresIn,
  });
  return token;
};
