// Import the setNotFoundResponse function for handling "not found" responses
import { setNotFoundResponse } from "../controllers/response-handler.js";
// Import the CommentModel for interacting with the Comment data in the database
import CommentModel from "../models/comment-model.js";
import WorkItemModel from "../models/workItem-model.js";
// Import the generateUniqueId function for creating unique comment IDs
import { generateUniqueId } from "../utils/id-generator.js";

// Retrieve a comment based on the associated work item ID
export const getCommentByStoryId = async (workItemId) => {
  try {
    console.log(workItemId);
    // Find comments in the database with the specified work item ID
    const comment = await CommentModel.find({ workItemId }).exec();
    console.log(comment);
    return comment;
  } catch (err) {
    console.log(err);
    // Propagate the error to the calling code
    throw err;
  }
};

// Create a new comment in the database
export const createComment = async (commentDetails) => {
  try {
    const comment = new CommentModel({
      ...commentDetails,
    });
    const newComment = await comment.save();
    const workItem = await WorkItemModel.findById({
      _id: commentDetails.workItemId,
    });

    console.log("------------", workItem);

    // If the project is found, push the new workItemId to its workItems array
    if (workItem) {
      workItem.comments.push(comment._id);
      await workItem.save();
    } else {
      throw new Error(`WorkItem with ID ${commentDetails.workItem} not found`);
    }
    const res = await CommentModel.findById(newComment._id)
      .populate("authorId")
      .select("-password")
      .exec();
    return res;
  } catch (err) {
    throw err;
  }
};

// Update an existing comment in the database
export const updateComment = async (commentId, commentDetails) => {
  try {
    commentDetails = { ...commentDetails, lastUpdatedAt: new Date() };
    const updatedComment = await CommentModel.findByIdAndUpdate(
      { _id: commentId },
      commentDetails,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("authorId")
      .select("-password")
      .exec();
    // Log whether the comment was found and updated
    if (!updatedComment) {
      console.log("comment not found.");
      throw new Error(`comment with ID ${commentId} not found`);
    } else {
      console.log("Updated comment:", updatedComment);
    }
    // Return the updated comment
    return updatedComment;
  } catch (err) {
    throw err;
  }
};

// Delete a comment from the database based on its commentId
export const deleteComment = async (commentId) => {
  try {
    const comment = await CommentModel.findByIdAndDelete({
      _id: commentId,
    }).exec();
    if (comment) {
      const updatedWorkitems = await WorkItemModel.findByIdAndUpdate(
        comment.workItemId,
        { $pull: { comments: commentId } },
        { new: true, runValidators: true }
      ).exec();

      if (updatedWorkitems) {
        const commentIndex = updatedWorkitems.comments.indexOf(commentId);
        if (commentIndex !== -1) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};
