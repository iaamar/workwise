import { Flex, Text, position } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import exp from "constants";
import _, { round } from "lodash";
import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBookmark,
  FaCheckSquare,
  FaExclamationCircle,
} from "react-icons/fa";
import EditWorkItemModel from "../EditWorkItemModel";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import {
  setCurrentWorkItem,
  workitemsFetched,
} from "../../store/slices/workitem-slice";
import Avatar from "react-avatar";
import src from "react-select/dist/declarations/src";
import { resetTaskState } from "../../store/slices/task-slice";
import { resetCommentState } from "../../store/slices/comment-slice";
import { getWorkItems } from "../../services/workitem-service";
import { fetchProjectDetails } from "../../store/slices/project-slice";

// Props interface for KanbanCard component
interface Props {
  title: string;
  workitem: any;
  index: any;
  parent: string;
  teamMembers: any;
}

const KanbanCard = ({ title, workitem, index, parent, teamMembers }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: workitem._id,
      data: {
        title,
        index,
        parent,
        selectedWorkItem: workitem,
      },
    });

  // Style for the card's transform based on drag and drop movement
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Redux dispatch function and local state for managing selected work item and editing status
  const dispatch: AppDispatch = useDispatch();
  const [selectedWorkItem, setSelectedWorkItem] = useState<any>();
  const [editWorkItem, setEditWorkItem] = useState(false);

  // Event handler for double-click on the card to open EditWorkItemModel
  const handleClick = () => {
    console.log("clicked");
    setEditWorkItem(true);
    dispatch(setCurrentWorkItem(workitem));
    setSelectedWorkItem(workitem);
  };

  // Render the KanbanCard component
  return (
    <>
      {/* Draggable Flex container representing the Kanban card */}
      <Flex
        backgroundColor="white"
        margin="2"
        borderRadius="4"
        border="2px solid gray.500"
        className="hover:shadow-lg pl-2 pr-1.5 pt-2 "
        transform={style.transform}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={{ position: isDragging ? "absolute" : "relative" }}
        onClick={(e) => {
          if (e.detail === 2) {
            console.log("Double Clicked");
          }
        }}
      >
        <div
          onClick={() => {
            console.log("clicked");
            setEditWorkItem(true);
            dispatch(setCurrentWorkItem(workitem));
            setSelectedWorkItem(workitem);
          }}
          key={workitem?._id}
          style={{ flex: 1 }}
          className="flex flex-col gap-3"
        >
          {/* Title and priority information */}
          <div className="font-medium flex text-primary justify-between">
            {workitem.title}
            <div className="itemPriority">
              {workitem.priority === "highest" ? (
                <FaArrowUp fill="#cd1316" size={15} />
              ) : null}
              {workitem.priority === "high" ? (
                <FaArrowUp fill="#e94949" size={15} />
              ) : null}
              {workitem.priority === "medium" ? (
                <FaArrowUp fill="#e97f33" size={15} />
              ) : null}
              {workitem.priority === "low" ? (
                <FaArrowDown fill="#2d8738" size={15} />
              ) : null}
              {workitem.priority === "lowest" ? (
                <FaArrowDown fill="#57a55a" size={15} />
              ) : null}
            </div>
          </div>

          {/* ID and type information */}
          <div className="flex flex-row justify-between items-end">
            <div className="itemId flex flex-row justify-between items-center gap-3">
              <div>
                {/* Type icons based on work item type */}
                {workitem.workitemId.split("-")[0] === "STORY" ? (
                  <FaCheckSquare fill="#4BADE8" size={13} />
                ) : null}
                {workitem.workitemId.split("-")[0] === "FEATURE" ? (
                  <FaBookmark fill="#65ba43" size={13} />
                ) : null}
                {workitem.workitemId.split("-")[0] === "BUG" ? (
                  <FaExclamationCircle fill="#e44d42" size={13} />
                ) : null}
              </div>
              <div className="text-xs text-grey-500">{workitem.workitemId}</div>
            </div>

            {/* Assignees avatars */}
            <div className="flex">
              {workitem?.assignees?.map((assignee: any) => (
                <div className="flex flex-row items-center">
                  <Avatar
                    name={assignee?.name}
                    size="20"
                    round={true}
                    src={assignee?.photoURL}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex"></div>
        </div>
      </Flex>

      {/* EditWorkItemModel component */}
      {editWorkItem && (
        <EditWorkItemModel
          onClose={() => {
            setEditWorkItem(false);
            setSelectedWorkItem(undefined);
            dispatch(setCurrentWorkItem(null));
            dispatch(resetCommentState());
            dispatch(resetTaskState());
          }}
          teamMembers={teamMembers}
          workItem={selectedWorkItem}
        />
      )}
    </>
  );
};
export default KanbanCard;
