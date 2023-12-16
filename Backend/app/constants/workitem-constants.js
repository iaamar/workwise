const WorkItemType = {
  BUG: "bug",
  FEATURE: "feature",
  STORY: "story",
}; // enum for work item type

const WorkItemStatus = {
  BACKLOG: "backlog",
  SELECTED: "selected",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
}; // enum for work item status

const WorkItemPriority = {
  HIGHEST: "highest",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  LOWEST: "lowest",
}; // enum for work item priority

export default {
  WorkItemType,
  WorkItemStatus,
  WorkItemPriority,
}; // export all enums
