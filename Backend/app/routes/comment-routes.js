// Import the Express framework for handling HTTP requests
import express from 'express';
// Import the commentController module for handling comment-related operations
import * as commentController from '../controllers/comment-controller.js';

// Create an instance of the Express Router
const Router = express.Router();

// Route: /comments
Router.route('/')
    // Post a new comment
    .post(commentController.postComment);
Router.route('/:id')
    // Get a comment by its ID
    .get(commentController.getComment)
    // Update a comment by its ID
    .put(commentController.putComment)
    // Delete a comment by its ID
    .delete(commentController.removeComment);

// Export the Router for use in other parts of the application
export default Router;
