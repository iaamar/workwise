// Import the CommentService module for interacting with comment-related data
import * as CommentService from "../services/comment-service.js";

// Import response handling functions from the response-handler module
import {
  setResponse,
  setNotFoundResponse,
  setErrorResponse,
} from "../controllers/response-handler.js";

// Retrieve a comment by its associated story ID
export const getComment = async (req, res) => {
  try {
    // Attempt to fetch the comment using the CommentService
    const comment = await CommentService.getCommentByStoryId(req.params.id);
    // If the comment is not found, return a 404 response
    if (!comment) return setNotFoundResponse(res);
    // Otherwise, return the comment
    return setResponse(comment, res);
  } catch (err) {
    console.log(err);
    // Set an error response if an exception is caught
    return setErrorResponse(err, res);
  }
};

// Create a new comment
export const postComment = async (req, res) => {
  try {
    // Extract the new comment data from the request body
    const newComment = req.body;
    // Call the CommentService to create the new comment
    const comment = await CommentService.createComment(newComment);
    // Return the newly created comment as a successful response
    return setResponse(comment, res);
  } catch (err) {
    console.log(err);
    // Set an error response if an exception is caught
    return setErrorResponse(err, res);
  }
};

// Update an existing comment
export const putComment = async (req, res) => {
  try {
    // Call the CommentService to update the comment by its ID
    const comment = await CommentService.updateComment(req.params.id, req.body);
    // If no comment is found, set a "not found" response
    if (!comment) return setNotFoundResponse(res);
    // Return the updated comment as a successful response
    return setResponse(comment, res);
  } catch (err) {
    // Set an error response if an exception is caught
    return setErrorResponse(err, res);
  }
};

// Remove an existing comment
export const removeComment = async (req, res) => {
  try {
    // Call the CommentService to delete the comment by its ID
    const comment = await CommentService.deleteComment(req.params.id);
    // If no comment is found, set a "not found" response
    if (!comment) return setNotFoundResponse(res);
    // Return the deleted comment as a successful response
    return setResponse(comment, res);
  } catch (err) {
    // Set an error response if an exception is caught
    return setErrorResponse(err, res);
  }
};
