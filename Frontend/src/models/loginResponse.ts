// Importing the User interface from the './user' module
import User from "./user";

// Definition of the LoginResponse interface
interface LoginResponse {
  status: string;
  data?: User;
  message?: string;
}
export default LoginResponse;
