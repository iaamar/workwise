// Definition of the Task interface
interface Task {
  _id: string;
  description: string;
  ownerId: string;
  workItemId: string;
  completed: boolean;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export default Task;
