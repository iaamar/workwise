import { setNotFoundResponse } from "../controllers/response-handler.js";
import TaskModel from "../models/task-model.js";
import { generateUniqueId } from "../utils/id-generator.js";
import WorkItemModel from "../models/workItem-model.js";

//Function for creating a new task

export const createTask = async (taskDetails) => {
  try {
    console.log("Inside createTask in service");
    const task = new TaskModel({
      ...taskDetails,
      taskId: generateUniqueId("tssajxnakjk"),
    });
    const newTask = await task.save();
    const workItem = await WorkItemModel.findById({
      _id: task.workItemId,
    });

    // If the project is found, push the new workItemId to its workItems array
    if (workItem) {
      workItem.tasks.push(newTask._id);
      await workItem.save();
    } else {
      throw new Error(`WorkItem with ID ${newTask.workItem} not found`);
    }
    console.log(`New task saved to collection: ${newTask.collection.name}`);
    const res = await TaskModel.findById(newTask._id)
      .populate("ownerId")
      .select("-password")
      .exec();
    return res;
  } catch (err) {
    throw err;
  }
};

//  Function for getting a task by id

export const getTaskById = async (taskId) => {
  try {
    console.log("Inside getTaskById in service" + taskId);
    const task = await TaskModel.find({ _id: taskId })
      .populate("ownerId")
      .select("-password")
      .exec();
    console.log(task);
    if (task) return task;
    else return false;
  } catch (err) {
    throw err;
  }
};

//Function for updating a task

export const updateTask = async (taskId, taskDetails) => {
  try {
    console.log("Inside updateTask in service" + taskId);
    taskDetails = { ...taskDetails, lastUpdatedAt: new Date() };
    const updatedTask = await TaskModel.findByIdAndUpdate(
      { _id: taskId },
      taskDetails,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("ownerId")
      .select("-password")
      .exec();

    if (!updatedTask) {
      console.log("Task not found.");
    } else {
      console.log("Updated Task:", updatedTask);
    }
    return updatedTask;
  } catch (err) {
    throw err;
  }
};

//Function for deleting a task

export const deleteTask = async (taskId) => {
  try {
    const task = await TaskModel.findByIdAndDelete({ _id: taskId }).exec();
    // If the task was deleted successfully
    if (task) {
      // Remove the task ID from the workitems collection
      const updatedWorkitems = await WorkItemModel.findByIdAndUpdate(
        task.workItemId,
        { $pull: { tasks: taskId } },
        { new: true, runValidators: true }
      ).exec();

      if (updatedWorkitems) {
        // Check if the task ID was successfully removed from the tasks array
        const taskIndex = updatedWorkitems.tasks.indexOf(taskId);
        if (taskIndex !== -1) {
          // Task ID still exists in the tasks array, update was not successful
          return false;
        } else {
          // Task ID was successfully removed from the tasks array
          return true;
        }
      } else {
        // Handle the case where the task ID was not found in workitems
        return false;
      }
    } else {
      // Handle the case where the task was not found
      return false;
    }
  } catch (err) {
    console.log(err);

    throw err;
  }
};
