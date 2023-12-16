import WorkItemModel from "../models/workItem-model.js";
import ProjectModel from "../models/project-model.js";
import CommentModel from "../models/comment-model.js";

import { generateUniqueId } from "../utils/id-generator.js";
import TaskModel from "../models/task-model.js";
import UserModel from "../models/user-model.js";

/* Function for searching a workItem */

export const searchWorkItems = async (searchTerm = {}) => {
  try {
    const workItems = await WorkItemModel.find(searchTerm).exec();
    return workItems;
  } catch (error) {
    throw error;
  }
};

/* Function for getting a workItem by id */
export const getWorkItemById = async (workItemId) => {
  try {
    const workItem = await WorkItemModel.findById({ _id: workItemId })
      .populate("comments") // populate comments
      .populate("tasks") // populate tasks
      .populate({ path: "assignees", select: "-password" }) // populate assignees
      .populate({ path: "ownerId", select: "-password" }) // populate owner with _id, and email
      .exec(); // find workItem by id
    if (!workItem) {
      throw new Error(`Work item with ID ${workItemId} not found`);
    } else {
      console.log("Work item:", workItem);
    }
    return workItem;
  } catch (error) {
    throw error;
  }
};

/* Function for creating a new workItem */
export const createWorkItem = async (workItemDetails) => {
  try {
    console.log(workItemDetails);
    const workItem = new WorkItemModel({
      ...workItemDetails,
      workitemId: generateUniqueId(
        workItemDetails.type ? workItemDetails.type.toUpperCase() : "STORY"
      ),
    }); // create a new workItem
    const newworkItem = await workItem.save(); // save the workItem

    const project = await ProjectModel.findById({
      _id: workItemDetails.projectId,
    }); // find project by id

    console.log("------------", project);

    // If the project is found, push the new workItemId to its workItems array
    if (project) {
      project.workitems.push(newworkItem._id);
      await project.save();
    } else {
      throw new Error(`Project with ID ${workItemDetails.projectId} not found`);
    }
    // return newworkItem;
    const res = await WorkItemModel.findById({ _id: newworkItem._id })
      .populate({ path: "assignees", select: "-password" }) // populate assignees
      .populate({ path: "ownerId", select: "-password" }) // populate owner
      .exec();
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/* Function for updating a workItem */
export const updateWorkItem = async (workItemId, workItemDetails) => {
  try {
    workItemDetails = {
      ...workItemDetails,
      lastUpdatedAt: new Date(),
    }; // update lastUpdatedAt

    const updatedworkItem = await WorkItemModel.findByIdAndUpdate(
      { _id: workItemId },
      workItemDetails,
      {
        new: true,
        runValidators: true,
      }
    ); // find workItem by id and update the workItem details

    if (!updatedworkItem) {
      throw new Error(`Work item with ID ${workItemId} not found`);
    } else {
      console.log("Updated workItem:", updatedworkItem);
    }
    return updatedworkItem;
  } catch (error) {
    throw error;
  }
};

/* Function for deleting a workItem */
// export const deleteWorkItem = async (workItemId) => {
//   try {
//     const workItem = await WorkItemModel.deleteOne({ _id: workItemId }); // find workItem by id and delete the workItem
//     console.log("***************", workItem);

//     if (workItem) {
//       const updatedProjectItems = await ProjectModel.findByIdAndUpdate(
//         workItem.projectId,
//         { $pull: { workitems: workItemId } },
//         { new: true, runValidators: true }
//       ).exec();

//       if (updatedProjectItems) {
//         console.log("updatedProjectItems---", updatedProjectItems);
//         const workItemIndex = updatedProjectItems.workitems.indexOf(workItemId);
//         if (workItemIndex !== -1) {
//           return false;
//         } else {
//           return true;
//         }
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const fetchCommentsOfAWorkItem = async (workItemId) => {
//   try {
//     const workItem = await WorkItemModel.findById(
//       { _id: workItemId },
//       { comments: 1 }
//     ).exec();

//     console.log(workItem);

//     if (!workItem) {
//       throw new Error("WorkItem not found.");
//     }

//     const commentsOfAWorkItem = await CommentModel.find({
//       commentId: { $in: workItem.comments },
//     }).exec();
//     return commentsOfAWorkItem;
//   } catch (error) {
//     throw error;
//   }
// };

// export const fetchTasksOfAWorkItem = async (workItemId) => {
//   try {
//     const workItem = await WorkItemModel.findOne(
//       { _id: workItemId },
//       { tasks: 1 }
//     ).exec();

//     console.log(workItem);

//     if (!workItem) {
//       throw new Error("WorkItem not found.");
//     }

//     const tasksOfAWorkItem = await TaskModel.find({
//       taskId: { $in: workItem.tasks },
//     }).exec();
//     return tasksOfAWorkItem;
//   } catch (error) {
//     throw error;
//   }
// };

// export const fetchAssignesOfAWorkItem = async (workItemId) => {
//   try {
//     const workItem = await WorkItemModel.findOne(
//       { _id: workItemId },
//       { assignes: 1 }
//     ).exec();

//     console.log(workItem);

//     if (!workItem) {
//       throw new Error("WorkItem not found.");
//     }

//     const assignesOfAWorkItem = await UserModel.find({
//       userId: { $in: workItem.assignes },
//     }).exec();
//     return assignesOfAWorkItem;
//   } catch (error) {
//     throw error;
//   }
// };

export const deleteWorkItem = async (workItemId) => {
  try {
    const deletedWorkItem = await WorkItemModel.findByIdAndDelete(workItemId);

    if (!deletedWorkItem) {
      console.log(`Work item with ID ${workItemId} not found.`);
      return false;
    }

    const projectId = deletedWorkItem.projectId;

    const updatedProjectItems = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $pull: { workitems: workItemId } },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedProjectItems) {
      console.log(`Project with ID ${projectId} not found.`);
      return false;
    }

    console.log("Updated Project Items:", updatedProjectItems);

    const workItemIndex = updatedProjectItems.workitems.indexOf(workItemId);
    if (workItemIndex !== -1) {
      console.log(`Work item with ID ${workItemId} not removed from project.`);
      return false;
    }

    console.log(`Work item with ID ${workItemId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting work item:", error);
    throw error;
  }
};
