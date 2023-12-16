import Comment from "../models/comment";
import * as baseService from "./base-service";

const commentResourcePath = "/comments";

// Function to handle updating a comment
export const updateComment = async (comment: Comment): Promise<Comment> => {
  const commentId = comment._id;
  const updatedComment = await baseService.update<Comment>(
    `${commentResourcePath}/${commentId}`,
    { description: comment.description }
  );
  return updatedComment;
};

// Function to handle creating a new comment
export const createComment = async (comment: any): Promise<any> => {
  console.log("createComment in service", comment);
  const newComment = await baseService.post<Comment>(
    commentResourcePath,
    comment
  );
  console.log("newComment in service", newComment);
  return newComment;
};

// Function to handle deleting a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await baseService.remove(
    `${commentResourcePath}/${commentId}`
  );
  return response;
};
