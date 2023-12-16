// Import the modeules
import User from "./user";
import WorkItem from "./workitem";

// Definition of the Project interface
interface Project {
  _id?: string;
  name: string;
  description: string;
  workitems?: Array<WorkItem> | string[];
  teamMembers?: Array<User> | string[];
  projectOwnerId: User | string;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  projectImage?: string;
}
export default Project;
