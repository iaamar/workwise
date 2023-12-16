import * as authService from "../services/auth-service.js";
import generateJwt from "../utils/jwt-generator.js";
import createCookie from "../utils/create-cookie.js";
import { cookieConfig } from "../utils/create-cookie.js";
import jwt from "jsonwebtoken";
import {
  setResponse,
  setErrorResponse,
  setUnauthorizedResponse,
  setUserDoenstExistResponse,
} from "./response-handler.js";

export const authenticateUser = async (req, res) => {
  try {
    const user = await authService.authenticateUser(req, res); // authenticate user
    if (!user) {
      // if user is not found
      setUnauthorizedResponse(res);
    } else {
      // else if user is found
      const token = generateJwt({ userId: user._id }); // generate jwt token
      const newres = createCookie(res, token); // create cookie

      setResponse(user, newres);
    }
  } catch (error) {
    setErrorResponse(error, res); // set error response
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("work-wise", cookieConfig);
  setResponse("Logged out successfully", res);
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body; // get old password and new password from request body
    const user = await authService.changePassword(
      req.user._id,
      oldPassword,
      newPassword
    ); // authenticate user
    if (!user) {
      // if user is not found
      setUnauthorizedResponse(res);
    } else {
      // else if user is found
      const token = generateJwt({ userId: user._id }); // generate jwt token
      const newres = createCookie(res, token); // create cookie
      setResponse(user, newres);
    }
  } catch (error) {
    setErrorResponse(error, res); // set error response
  }
};

export const authMiddleware = (req, res, next) => {
  console.log("####################", req.cookies["work-wise"]);
  const cookie = req.cookies["work-wise"];
  let token;
  if (!cookie) {
    setUnauthorizedResponse(res);
  } else {
    token = JSON.parse(cookie).token;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    console.log("payload", payload);
    req.user = payload;
    next();
  } catch (error) {
    console.log("error****************", error);
    res.clearCookie("work-wise", cookieConfig);
    setUnauthorizedResponse(res);
  }
};

export const resetPasswordRequest = async (req, res, next) => {
  try {
    const requestPasswordResetService = await authService.requestPasswordReset(
      req.body.email
    );
    console.log("requestPasswordResetService", requestPasswordResetService);
    return res.json(requestPasswordResetService);
  } catch (error) {
    console.log("error****************", error);
    setUserDoenstExistResponse(res);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordService = await authService.resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

export const verifyToken = async (req, res, next) => {
  const verifyTokenService = await authService.verifyToken(
    req.body.userId,
    req.body.token
  );
  return res.json(verifyTokenService);
};
