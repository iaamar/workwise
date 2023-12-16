// Work Item Types
export const WorkItemType = {
  FEATURE: "feature",
  BUG: "bug",
  STORY: "story",
};

// Work Item Statuses
export const WorkItemStatus = {
  BACKLOG: "backlog",
  SELECTED: "selected",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
};

// Work Item Priorities
export const WorkItemPriority = {
  HIGHEST: "highest",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  LOWEST: "lowest",
};

// Copy of Work Item Types
export const WorkItemTypeCopy = {
  [WorkItemType.FEATURE]: "FEATURE",
  [WorkItemType.BUG]: "Bug",
  [WorkItemType.STORY]: "Story",
};

// Copy of Work Item Statuses
export const WorkItemStatusCopy = {
  [WorkItemStatus.BACKLOG]: "BACKLOG",
  [WorkItemStatus.SELECTED]: "SELECTED FOR DEVELOPMENT",
  [WorkItemStatus.INPROGRESS]: "IN PROGRESS",
  [WorkItemStatus.COMPLETED]: "COMPLETED",
};

// Copy of Work Item Priorities
export const WorkItemPriorityCopy = {
  [WorkItemPriority.HIGHEST]: "Highest",
  [WorkItemPriority.HIGH]: "High",
  [WorkItemPriority.MEDIUM]: "Medium",
  [WorkItemPriority.LOW]: "Low",
  [WorkItemPriority.LOWEST]: "Lowest",
};
