//import * as authService from "../services/auth-service.js";
import * as TaskService from "../services/task-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";

//Controller for adding a task

export const postTask = async (req, res) => {
  try {
    console.log("Inside postTask");
    const task = req.body;
    //onsole.log(newTask);
    //Rename it to TaskService later but its not important
    const newTask = await TaskService.createTask(task);
    return setResponse(newTask, res);
  } catch (err) {
    console.log("Error in postTask");
    console.log(err);
    return setErrorResponse(err, res);
  }
};

//Controller function for getting a task by id

export const getTask = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (!task) return setNotFoundResponse(res);
    return setResponse(task, res);
  } catch (err) {
    return setErrorResponse(err, res);
  }
};

//Controller function for updating a task

export const putTask = async (req, res) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.body);
    if (!task) return setNotFoundResponse(res);
    return setResponse(task, res);
  } catch (err) {
    return setErrorResponse(err, res);
  }
};

//Controller function for deleting a task

export const removeTask = async (req, res) => {
  try {
    console.log("Inside removeTask");
    const task = await TaskService.deleteTask(req.params.id);
    if (!task) return setNotFoundResponse(res);
    return setResponse(task, res);
  } catch (err) {
    return setErrorResponse(err, res);
  }
};
