// Import the Mongoose library for MongoDB schema and model creation
import mongoose from "mongoose";

// Create a Mongoose Schema instance
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      ref: "WorkItem",
      required: true,
    },
  },
  { versionKey: false }
);

// Create a Mongoose model based on the defined schema
const CommentModel = mongoose.model("Comment", commentSchema);

// Export the CommentModel for use in other parts of the application
export default CommentModel;
