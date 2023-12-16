import * as projectController from "../controllers/project-controller.js";
import express from "express";
// Router is a middleware that will handle all the requests to /api/projects
const Router = express.Router();
// The following code will be executed when a request is made to /api/projects
Router.route("/")
  .get(projectController.searchProjects)
  .post(projectController.postProject);
  // The following code will be executed when a request is made to /api/projects/:id
Router.route("/:id")
  .get(projectController.getProject)
  .put(projectController.putProject)
  .delete(projectController.removeProject);
// The following code will be executed when a request is made to /api/projects/:id/workitems
Router.route("/:id/workitems").get(projectController.getAllWorkItemsofProject);

export default Router;
