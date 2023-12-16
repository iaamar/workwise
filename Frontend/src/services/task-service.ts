import Task from "../models/task";
import * as baseService from "./base-service";

const taskResourcePath = "/tasks";

// Function to handle updating a task
export const updateTask = async (task: Task): Promise<any> => {
  const taskId = task._id;
  const updatedtask = await baseService.update<Task>(
    `${taskResourcePath}/${taskId}`,
    task
  );
  return updatedtask;
};

// Function to handle creating a new task
export const createTask = async (task: Task): Promise<Task> => {
  console.log("createtask in service", task);
  const newtask = await baseService.post<Task>(taskResourcePath, task);
  console.log("newtask in service", newtask);
  return newtask;
};

// Function to handle deleting a task
export const deleteTask = async (taskId: string): Promise<void> => {
  const response = await baseService.remove(`${taskResourcePath}/${taskId}`);
  return response;
};
