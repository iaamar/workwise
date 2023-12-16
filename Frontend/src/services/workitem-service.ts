import WorkItem from "../models/workitem";

import * as baseService from "./base-service";

const workItemResourcePath = "/workitems";

// Function to handle updating a work item
export const updateWorkItem = async (workitem: WorkItem): Promise<WorkItem> => {
  const workitemId = workitem._id;
  const updatedWorkItem = await baseService.update<WorkItem>(
    `${workItemResourcePath}/${workitemId}`,
    workitem
  );
  return updatedWorkItem;
};

// Function to handle creating a new work item
export const createWorkItem = async (workitem: WorkItem): Promise<WorkItem> => {
  console.log("createWorkItem in service", workitem);
  const newWorkItem = await baseService.post<WorkItem>(
    workItemResourcePath,
    workitem
  );
  console.log("newWorkItem in service", newWorkItem);
  return newWorkItem;
};

// Function to handle deleting a work item
export const deleteWorkItem = async (workitemId: string): Promise<any> => {
  const response = await baseService.remove(
    `${workItemResourcePath}/${workitemId}`
  );
  console.log("deleteWorkItem in service", response);
  return response;
};

// Function to retrieve a list of work items
export const getWorkItems = async (): Promise<WorkItem[]> => {
  const workitems = await baseService.get<WorkItem[]>(workItemResourcePath);
  return workitems;
};

// Function to retrieve a specific work item by ID
export const getWorkItemById = async (
  workitemId: string
): Promise<WorkItem> => {
  const workitem = await baseService.getById<WorkItem>(
    `${workItemResourcePath}/${workitemId}`
  );
  return workitem;
};
