import * as projectService from "../services/project-service.js";
import {
  setResponse,
  setNotFoundResponse,
  setErrorResponse,
} from "../controllers/response-handler.js";

// *Controller is a class that will handle all the requests to the API*

// searchProjects is a function that will be called when a GET request is made to /api/projects
export const searchProjects = async (req, res) => {
  try {
    const params = { ...req.query };
    const projects = await projectService.getAllProjects(params);
    return setResponse(projects, res);
  } catch (error) {
    return setErrorResponse(error, res);
  }
};
// getProject is a function that will be called when a GET request is made to /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return setNotFoundResponse(res);
    return setResponse(project, res);
  } catch (error) {
    return setErrorResponse(error, res);
  }
};
// postProject is a function that will be called when a POST request is made to /api/projects
export const postProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req, res);
    return setResponse(project, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};
// putProject is a function that will be called when a PUT request is made to /api/projects/:id
export const putProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req, res);
    if (!project) return setNotFoundResponse(res);
    return setResponse(project, res);
  } catch (error) {
    return setErrorResponse(error, res);
  }
};
// removeProject is a function that will be called when a DELETE request is made to /api/projects/:id
export const removeProject = async (req, res) => {
  try {
    const project = await projectService.deleteProject(req, res);
    if (!project) return setNotFoundResponse(res);
    return setResponse(
      {
        status: "success",
        message: "Resource successfully deleted",
        deletedResourceId: req.params.id,
      },
      res
    );
  } catch (error) {
    return setErrorResponse(error, res);
  }
};
// getAllWorkItemsofProject is a function that will be called when a GET request is made to /api/projects/:id/workitems
export const getAllWorkItemsofProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const workItems = await projectService.getAllWorkItemsofProject(projectId);
    setResponse(workItems, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};
