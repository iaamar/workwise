import * as userService from "../services/user-service.js";
import createCookie from "../utils/create-cookie.js";
import generateJwt from "../utils/jwt-generator.js";

import {
  setResponse,
  setErrorResponse,
  setUserExistsResponse,
  setCreatedResponse,
} from "./response-handler.js";

/** Controller function for searching users based on query parameters */

export const searchUsers = async (req, res) => {
  try {
    const params = { ...req.query }; // get query parameters
    const users = await userService.searchUsers(params); // Calling the userService to search for users
    setResponse(users, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for creating a new user */

export const createUser = async (req, res) => {
  try {
    const newUser = req.body; // get user details from request body
    const user = await userService.createUser(newUser); // Calling the userService to create a new user
    // const token = generateJwt({ userId: user._id });
    // const newres = createCookie(res, token);
    setCreatedResponse(user, res);
  } catch (error) {
    console.log("@@@@@@", error);
    if (
      error.message === "userexists" // If user already exists
    ) {
      setUserExistsResponse(res);
    } else {
      // If any other error occurs
      error.errorMessage = "Something went wrong";
      setErrorResponse(error, res);
    }
  }
};

/** Controller function for getting a user by id */
export const getUserById = async (req, res) => {
  try {
    console.log(req.params);
    const userId = req.params.id; // get user id from request parameters
    const user = await userService.getUserById(userId); // Calling the userService to get a user by id
    setResponse(user, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for updating a user */
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // get user id from request parameters
    const updatedUserDetails = req.body; // get updated user details from request body
    const user = await userService.updateUser(userId, updatedUserDetails); // Calling the userService to update a user
    setResponse(
      {
        status: "success",
        message: "User Details Updated successfully",
        data: user,
      },
      res
    );
  } catch (error) {
    setErrorResponse(error, res);
  }
};

/** Controller function for deleting a user */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // get user id from request parameters
    console.log("controller---------", userId);
    const user = await userService.deleteUser(userId); // Calling the userService to delete a user
    console.log("controller", user);
    setResponse(user, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.params.id; // get user id from request parameters
    const projects = await userService.getUserProjects(userId); // Calling the userService to get a user's projects
    setResponse(projects, res);
  } catch (error) {
    setErrorResponse(error, res);
  }
};
