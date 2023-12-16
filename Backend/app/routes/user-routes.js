import express from "express";
import * as userController from "../controllers/user-controller.js";

const Router = express.Router();

Router.route("/").get(userController.searchUsers); // Route for searching users
// .post(userController.createUser);

Router.route("/:id")
  .get(userController.getUserById) // Route for getting a user by id
  .put(userController.updateUser) // Route for updating a user
  .delete(userController.deleteUser); // Route for deleting a user

Router.route("/:id/projects").get(userController.getUserProjects); // Route for getting a user's projects

export default Router;
