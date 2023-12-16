import LoginResponse from "../models/loginResponse";
import User from "../models/user";
import * as baseService from "./base-service";

const authResourcePath = "/auth";

// Function to handle user login
export const login = async (user: User): Promise<any> => {
  const response = await baseService.post<User>(
    `${authResourcePath}/login`,
    user
  );
  return response;
};

// Function to handle user signup
export const signup = async (user: User): Promise<User> => {
  const response = await baseService.post<User>(
    `${authResourcePath}/signup`,
    user
  );
  return response;
};

// Function to handle user logout
export const logout = async (user: User): Promise<any> => {
  const response = await baseService.post<User>(
    `${authResourcePath}/logout`,
    user
  );
  return response;
};

// Function to handle changing user password
export const changePassword = async (user: User): Promise<User> => {
  const response = await baseService.post<User>(
    `${authResourcePath}/change-password`,
    user
  );
  return response;
};

export const forgotPassword = async (email: string): Promise<any> => {
  const response = await baseService.post<any>(
    `${authResourcePath}/forgot-password`,
    { email: email }
  );
  return response;
};
export const resetPassword = async (user: any): Promise<any> => {
  const response = await baseService.post<any>(
    `${authResourcePath}/reset-password`,
    user
  );
  return response;
};

export const validateToken = async (tokenData: any): Promise<any> => {
  const response = await baseService.post<any>(
    `${authResourcePath}/verify-token`,
    tokenData
  );
  return response;
};
