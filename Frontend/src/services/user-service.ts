import User from "../models/comment";
import * as baseService from "./base-service";

const userResourcePath = "/users";

// Function to handle updating user data
export const updateUser = async (userData: User): Promise<any> => {
  const userId = userData._id;
  const updatedUserData = await baseService.update<User>(
    `${userResourcePath}/${userId}`,
    userData
  );
  return updatedUserData;
};

// Function to handle deleting a user
export const deleteUser = async (userId: string): Promise<any> => {
  const response = await baseService.remove(`${userResourcePath}/${userId}`);
  return response;
};

// Function to retrieve a list of users
export const getUsers = async (): Promise<any> => {
  const users = await baseService.get<User>(userResourcePath);
  return users;
};

export const getUserId = async (userId: string): Promise<User> => {
  const user = await baseService.getById<User>(
    `${userResourcePath}/${userId}`
  );
  return user;
}