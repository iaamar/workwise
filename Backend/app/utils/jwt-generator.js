import jwt from "jsonwebtoken";

const generateJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export default generateJwt;
