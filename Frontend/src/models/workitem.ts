// Importing the Task and User interfaces from the corresponding modules
import Task from "./task";
import User from "./user";

// Definition of the WorkItem interface
interface WorkItem {
  _id?: string;
  title?: string;
  description?: string;
  priority?: string;
  projectId?: string;
  status?: string;
  type?: string;
  workitemId?: string;
  estimatedCompletionTime?: Number;
  tasks?: Array<Task> | string[];
  comments?: Array<Comment> | string[];
  assignees?: Array<User> | string[];
  ownerId?: User | string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}

export default WorkItem;
