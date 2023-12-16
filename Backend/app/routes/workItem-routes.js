import express from "express";
import * as workItemController from "../controllers/workItem-controller.js";

const Router = express.Router();

Router.route("/")
  .get(workItemController.searchWorkItem) // Route for searching workItems
  .post(workItemController.createWorkItem); // Route for creating a new workItem

Router.route("/:id")
  .get(workItemController.getWorkItemById) // Route for getting a workItem by id
  .put(workItemController.updateWorkItem) // Route for updating a workItem
  .delete(workItemController.deleteWorkItem); // Route for deleting a workItem

// Router.route("/project/:id").get(workItemController.getAllWorkItemsofProject);

// Router.route("/:id/comments").get(workItemController.fetchCommentsOfAWorkItem);
// Router.route("/:id/assignes").get(workItemController.fetchAssignesOfAWorkItem);

export default Router;
