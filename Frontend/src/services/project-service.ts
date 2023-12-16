import Project from "../models/project";

import * as baseService from "./base-service";

const projectResourcePath = "/projects";

// Function to handle updating a project
export const updateProject = async (project: Project): Promise<Project> => {
  const projectId = project._id;
  const updatedProject = await baseService.update<Project>(
    `${projectResourcePath}/${projectId}`,
    project
  );
  return updatedProject;
};

const getRandomProjectImage = () => {
  const randomNumber = Math.floor(Math.random() * (26 - 0 + 1) + 0);
  const formattedNumber = randomNumber.toString().padStart(2, "0");
  console.log("formattedNumber", formattedNumber);
  return `https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/104${formattedNumber}?size=xxlarge`;
};

export const createProject = async (project: Project): Promise<Project> => {
  const newProject = await baseService.post<Project>(projectResourcePath, {
    ...project,
    projectImage: getRandomProjectImage(),
  });
  return newProject;
};

// Function to handle deleting a project
export const deleteProject = async (projectId: string): Promise<any> => {
  const response = await baseService.remove(
    `${projectResourcePath}/${projectId}`
  );
  console.log("deleteProject in service", response);
  return response;
};

// Function to get all projects
export const getProjects = async (): Promise<Project[]> => {
  const projects = await baseService.get<Project[]>(projectResourcePath);
  return projects;
};

// Function to get a project by ID
export const getProjectById = async (projectId: string): Promise<Project> => {
  const project = await baseService.getById<Project>(
    `${projectResourcePath}/${projectId}`
  );
  return project;
};

// Function to get work items by project ID
export const getWorkItemsByProjectId = async (
  projectId: string
): Promise<Project> => {
  const project = await baseService.getById<Project>(
    `${projectResourcePath}/${projectId}/workitems`
  );
  return project;
};

// Function to get projects associated with a user
export const getUsersProjects = async (userId: string): Promise<Project[]> => {
  const projects = await baseService.getById<Project[]>(
    `/users/${userId}/projects`
  );
  return projects;
};
