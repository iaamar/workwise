import * as authController from "../controllers/auth-controller.js";
import * as userController from "../controllers/user-controller.js";
import express from "express";

const Router = express.Router();
Router.route("/login").post(authController.authenticateUser);
Router.route("/logout").post(authController.logoutUser);
Router.route("/signup").post(userController.createUser);
Router.route("/change-password").put(
  authController.changePassword,
  authController.authMiddleware
);
Router.post("/forgot-password", authController.resetPasswordRequest);
Router.post("/reset-password", authController.resetPassword);
Router.post("/verify-token", authController.verifyToken);

export default Router;
