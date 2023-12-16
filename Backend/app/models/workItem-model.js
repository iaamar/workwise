import mongoose from "mongoose";
import Enums from "../constants/workitem-constants.js";
import CommentModel from "./comment-model.js";
import TaskModel from "./task-model.js";
const Schema = mongoose.Schema; // Schema alias

const workItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(Enums.WorkItemPriority), // enum for work item priority
      default: Enums.WorkItemPriority.MEDIUM, // default priority is medium
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId, // reference to project
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Enums.WorkItemStatus), // enum for work item status
      default: Enums.WorkItemStatus.BACKLOG, // default status is backlog
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(Enums.WorkItemType), // enum for work item type
      default: Enums.WorkItemType.STORY, // default type is story
      required: true,
    },
    workitemId: {
      type: String,
      required: true,
    },
    estimatedCompletionTime: {
      type: Number,
      default: 0,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ], // reference to tasks
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ], // reference to comments
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ], // reference to assignees
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // reference to owner
  },
  {
    versionKey: false, // disable versioning
  }
);

workItemSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    try {
      const workItemId = this.getFilter()._id;
      console.log("-----------------workItemId-------------------", workItemId);

      // Delete all related comments
      await CommentModel.deleteMany({ workItemId }).exec();

      // Delete all related tasks
      await TaskModel.deleteMany({ workItemId }).exec();

      next();
    } catch (error) {
      console.error("Error in deleteOne hook:", error);
      next(error); // Pass the error to continue the deletion process
    }
  }
);

const WorkItemModel = mongoose.model("WorkItem", workItemSchema); // Creating the workItem model

export default WorkItemModel;
