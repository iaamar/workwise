import { setNotFoundResponse } from "../controllers/response-handler.js";
import ProjectModel from "../models/project-model.js";
import WorkItemModel from "../models/workItem-model.js";
import CommentModel from "../models/comment-model.js";
import mongoose from "mongoose";
import TaskModel from "../models/task-model.js";
import UserModel from "../models/user-model.js";

// getAllProjects is a function that will be called when a GET request is made to /projects
export const getAllProjects = async (searchProjects = {}) => {
  const projects = await ProjectModel.find(searchProjects).exec();
  return projects;
};
// getProjectById is a function that will be called when a GET request is made to projects/:id
export const getProjectById = async (id) => {
  console.log("id", id);
  try {
    const project = await ProjectModel.findById(id)
      .populate({
        path: "workitems",
        populate: [
          {
            path: "comments",
            model: "Comment",
            populate: {
              path: "authorId",
              model: "User",
              select: "-password",
            },
          },
          {
            path: "tasks",
            model: "Task",
            populate: {
              path: "ownerId",
              model: "User",
              select: "-password",
            },
          },
          {
            path: "assignees",
            model: "User",
            select: "-password",
          },
        ],
      }) //populate is used to get the details of the workitems
      .populate("teamMembers")
      .select("-password") //populate is used to get the details of the team members
      .exec();
    console.log("-----------", project);
    if (!project) return setNotFoundResponse(res);
    return project;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// createProject is a function that will be called when a POST request is made to /projects
export const createProject = async (req, res) => {
  try {
    const project = req.body;
    const newProject = new ProjectModel(project);
    await newProject.save();
    return newProject || null;
  } catch (error) {
    throw error;
  }
};
// updateProject is a function that will be called when a PUT request is made to /projects/:id
export const updateProject = async (req, res) => {
  const project = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return setNotFoundResponse(res);
  } else {
    return await ProjectModel.findByIdAndUpdate(req.params.id, project, {
      new: true,
    }).exec();
  }
};
// deleteProject is a function that will be called when a DELETE request is made to /projects/:id
export const deleteProject = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return setNotFoundResponse(res);
  return await ProjectModel.deleteOne({ _id: req.params.id }).exec(); //deleteOne is used to delete the project from the database
};
// getAllWorkItemsofProject is a function that will be called when a GET request is made to /projects/:id/workitems
export const getAllWorkItemsofProject = async (projectId) => {
  try {
    const workItems = await WorkItemModel.find({ projectId })
      .select("title priority status type workitemId assignees") //select is used to get the details of the workitems
      .exec(); //find is used to get the workitems from the database
    console.log(workItems);
    return workItems;
  } catch (error) {
    throw error;
  }
};
