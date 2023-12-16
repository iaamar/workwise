import UserModel from "../models/user-model.js";
import generateJwt from "../utils/jwt-generator.js";
import createCookie from "../utils/create-cookie.js";
import bcrypt from "bcrypt";
import ProjectModel from "../models/project-model.js";

/* Function for searching a  user */
export const searchUsers = async (searchTerm = {}) => {
  try {
    const users = await UserModel.find(searchTerm).select("-password").exec(); // find users based on search term and exclude password in the response
    return users;
  } catch (error) {
    throw error;
  }
};

/* Function for getting a user by id */
export const getUserById = async (userId) => {
  try {
    console.log(userId);
    const user = await UserModel.findById({ _id: userId })
      .select("-password")
      .exec(); // find user by id
    console.log(user);
    return user || null;
  } catch (error) {
    throw error;
  }
};

/* Function for creating a new user */
export const createUser = async (userDetails) => {
  try {
    const userExists = await UserModel.findOne({
      email: userDetails.email,
    }).exec(); // check if user exists
    if (userExists) {
      throw new Error("userexists"); // throw error if user exists
    }
    const hashedPassword = await bcrypt.hash(userDetails.password, 10); // hash the password
    const user = new UserModel({
      ...userDetails,
      password: hashedPassword, // replace the password with the hashed password
    });
    const savedUser = await user.save(); // save the user
    // Specify the fields to include (excluding the password field)
    const userWithoutPassword = await UserModel.findById(savedUser._id).select(
      "-password"
    );

    return {
      data: userWithoutPassword,
      status: "success",
      message: "User created successfully",
      code: 201,
    };
  } catch (error) {
    console.log("@@@@@@", error);
    throw error;
  }
};

/* Function for updating a user */
export const updateUser = async (userId, userDetails) => {
  try {
    if (userDetails.password) {
      const hashedPassword = await bcrypt.hash(userDetails.password, 10); // hash the password
      userDetails.password = hashedPassword;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      userDetails,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password"); // find user by id and update the user details
    console.log("-----", updatedUser);
    if (!updatedUser) {
      console.log("User not found.");
      throw new Error(`User with ID ${userId} not found`);
    } else {
      console.log("Updated user:", updatedUser);
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

/* Function for deleting a user */
export const deleteUser = async (userId) => {
  try {
    const user = await UserModel.deleteOne({ _id: userId }); // find user by id and delete the user
    console.log("delete user", user);
    if (user) {
      // await user.remove();
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserProjects = async (userId) => {
  try {
    // Find projects where the user is either the project owner or a team member
    const projects = await ProjectModel.find({
      $or: [{ projectOwnerId: userId }, { teamMembers: userId }],
    });

    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
