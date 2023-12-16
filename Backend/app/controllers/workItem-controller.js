import * as workItemService from "../services/workItem-service.js";

import { setResponse, setErrorResponse } from "./response-handler.js";

/** Controller function for searching workItems based on query parameters */
export const searchWorkItem = async (req, res) => {
  try {
    const params = { ...req.query };
    const workItems = await workItemService.searchWorkItems(params);
    setResponse(workItems, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for creating a new workItem */

export const createWorkItem = async (req, res) => {
  try {
    const newworkItem = req.body;
    console.log(newworkItem);
    const workItem = await workItemService.createWorkItem(newworkItem);
    console.log(workItem);
    setResponse(workItem, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for getting a workItem by id */

export const getWorkItemById = async (req, res) => {
  try {
    console.log(req.params);
    const workItemId = req.params.id;
    const workItem = await workItemService.getWorkItemById(workItemId);
    setResponse(workItem, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for updating a workItem */

export const updateWorkItem = async (req, res) => {
  try {
    const workItemId = req.params.id;
    const updatedworkItemDetails = req.body;
    const workItem = await workItemService.updateWorkItem(
      workItemId,
      updatedworkItemDetails
    );
    setResponse(workItem, res);
  } catch (error) {
    console.log(error);
    setErrorResponse(error, res);
  }
};

/** Controller function for deleting a workItem */

export const deleteWorkItem = async (req, res) => {
  try {
    const workItemId = req.params.id;
    const workItem = await workItemService.deleteWorkItem(workItemId);
    setResponse(workItem, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

// export const getAllWorkItemsofProject = async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const workItems = await workItemService.getAllWorkItemsofProject(projectId);
//     setResponse(workItems, res);
//   } catch (error) {
//     setErrorResponse(error, res);
//   }
// };

// export const fetchCommentsOfAWorkItem = async (req, res) => {
//   try {
//     const workItemId = req.params.id;
//     const comments = await workItemService.fetchCommentsOfAWorkItem(workItemId);
//     setResponse(comments, res);
//   } catch (error) {
//     setErrorResponse(error, res);
//   }
// };

// export const fetchTasksOfAWorkItem = async (req, res) => {
//   try {
//     const workItemId = req.params.id;
//     const tasks = await workItemService.fetchCommentsOfAWorkItem(workItemId);
//     setResponse(tasks, res);
//   } catch (error) {
//     setErrorResponse(error, res);
//   }
// };

// //TODO: duplicate code for tasks,assignes and comments
// export const fetchAssignesOfAWorkItem = async (req, res) => {
//   try {
//     const workItemId = req.params.id;
//     const assignes = await workItemService.fetchAssignesOfAWorkItem(workItemId);
//     setResponse(assignes, res);
//   } catch (error) {
//     setErrorResponse(error, res);
//   }
// };
