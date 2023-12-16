import mongoose from "mongoose";
import WorkItemModel from "./workItem-model.js";

const Schema = mongoose.Schema; //Schema is a class
//Schema is a class that takes an object as an argument
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    workitems: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkItem",
      },
    ],
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
    projectOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectImage: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

projectSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    try {
      const projectId = this.getFilter()._id;

      // Find all WorkItems associated with the project
      const workItems = await WorkItemModel.find({ projectId }).exec();

      // Delete all associated WorkItems and their Comments
      await Promise.all(
        workItems.map(async (workItem) => {
          await workItem.deleteOne(); // This will trigger the WorkItem's prex hook
        })
      );

      next();
    } catch (error) {
      console.error("Error in deleteOne hook:", error);
      next(error);
    }
  }
);

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
