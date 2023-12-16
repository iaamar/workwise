import mongoose from "mongoose";

import ProjectModel from "./project-model.js";
import WorkItemModel from "./workItem-model.js";
import CommentModel from "./comment-model.js";
import TaskModel from "./task-model.js";
const Schema = mongoose.Schema; // Schema alias

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Your email address is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    },
  },
  {
    versionKey: false,
  }
); // Creating the user schema

UserSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    try {
      const userId = this.getFilter()._id;

      const [userComments, userTasks] = await Promise.all([
        CommentModel.find({ authorId: userId }).select("_id"),
        TaskModel.find({ ownerId: userId }).select("_id"),
      ]);
      console.log("--------------------------comments", userComments);
      console.log("-----------------------------tasks", userTasks);
      const commentIdsToRemove = userComments.map((comment) => comment._id);
      const taskIdsToRemove = userTasks.map((task) => task._id);
      await WorkItemModel.updateMany(
        {
          $or: [
            { comments: { $in: commentIdsToRemove } },
            { tasks: { $in: taskIdsToRemove } },
          ],
        },
        {
          $pull: {
            comments: { $in: commentIdsToRemove },
            tasks: { $in: taskIdsToRemove },
          },
        }
      );

      await CommentModel.deleteMany({ authorId: userId });
      await TaskModel.deleteMany({ ownerId: userId });

      const userWorkItems = await WorkItemModel.find({
        ownerId: userId,
      }).select("_id");
      const workItemIdsToRemove = userWorkItems.map((workItem) => workItem._id);

      await ProjectModel.updateMany(
        { workitems: { $in: workItemIdsToRemove } },
        { $pull: { workitems: { $in: workItemIdsToRemove } } }
      );

      await WorkItemModel.updateMany(
        { assignees: userId },
        { $pull: { assignees: userId } }
      );

      await ProjectModel.deleteMany({ projectOwnerId: userId });

      await ProjectModel.updateMany(
        { teamMembers: userId },
        { $pull: { teamMembers: userId } }
      );
      await WorkItemModel.deleteMany({ ownerId: userId });

      next();
    } catch (error) {
      console.error("Error in deleteOne hook:", error);
      next(error);
    }
  }
);

const UserModel = mongoose.model("User", UserSchema); // Creating the user model

export default UserModel;
