// Importing the User interface from the './user' module
import User from "./user";

// Comment interface definition
interface Comment {
  _id?: string;
  description?: string;
  authorId?: User | string;
  workItemId?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export default Comment;
