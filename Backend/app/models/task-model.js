import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
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
    workItemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
