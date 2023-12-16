// Importing necessary modules and components
import {
  DndContext,
  rectIntersection,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import KanbanLane from "./KanbanLane";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { add } from "lodash";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../store/slices/user-slice";
import { FaPlus } from "react-icons/fa";
import EditWorkItemModel from "../EditWorkItemModel";
import CreateWorkItemModel from "../CreateWorkItemModel";
import { createNewWorkItem } from "../../store/slices/workitem-slice";
import WorkItem from "../../models/workitem";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { editWorkItem } from "../../store/slices/workitem-slice";
import { useTranslation } from "react-i18next";

// Interface for Cards representing the work items
export interface Cards {
  title: string;
  id?: number;
}

// Props interface for the KanbanBoard component
interface Props {
  onClose: () => void;
  workitems: any;
  teamMembers: any;
  projectId: string;
  ownerId: string;
}

// Default work item object used for creating new work items
const defaultWorkItem = {
  title: "",
  description: "",
  priority: "medium",
  status: "backlog",
  type: "story",
  estimatedCompletionTime: 0,
  assignees: [],
};

// KanbanBoard component for managing and displaying work items using a kanban board layout
const KanbanBoard = (props: Props) => {
  const { onClose, workitems, teamMembers, projectId, ownerId } = props;

  // State variables for managing work items in different lanes
  const [backlogItems, setBacklogItems] = useState<any>([]);
  const [completedItems, setCompletedItems] = useState<any>([]);
  const [inProgressItems, setInProgressItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);

  // useEffect to update lane items when workitems prop changes
  useEffect(() => {
    setBacklogItems(
      workitems.filter((workitem: any) => workitem.status === "backlog")
    );
    setCompletedItems(
      workitems.filter((workitem: any) => workitem.status === "completed")
    );
    setInProgressItems(
      workitems.filter((workitem: any) => workitem.status === "inprogress")
    );
    setSelectedItems(
      workitems.filter((workitem: any) => workitem.status === "selected")
    );
  }, [workitems]);

  // Redux dispatch function and currentUser from Redux store
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Setting up drag-and-drop sensors for DndContext
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  onClose();
  const { t } = useTranslation("common");

  // Render the KanbanBoard component
  return (
    <>
      {/* DndContext for enabling drag-and-drop functionality */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={(e) => {
          console.log(e.active.data.current);
          const container = e.over?.id;
          const title = e.active.data.current?.title;
          const index = e.active.data.current?.index;
          const parent = e.active.data.current?.parent;
          const selectedWorkItem = e.active.data.current?.selectedWorkItem;

          console.log(container?.toString().replace(/\s/g, "").toLowerCase());
          if (container && parent !== container) {
            dispatch(
              editWorkItem({
                _id: selectedWorkItem?._id,
                status: container?.toString().replace(/\s/g, "").toLowerCase(),
              })
            );
          }
        }}
      >
        {/* Flex container for the kanban board layout */}
        <Flex flexDirection="column">
          <Flex flex="4">
            {/* KanbanLane components representing different lanes on the board */}
            <KanbanLane
              projectId={projectId}
              title={t("board.kanban.backlog.label")}
              items={backlogItems}
              teamMembers={teamMembers}
            />
            <KanbanLane
              projectId={projectId}
              title={t("board.kanban.selected.label")}
              items={selectedItems}
              teamMembers={teamMembers}
            />
            <KanbanLane
              projectId={projectId}
              title={t("board.kanban.inprogress.label")}
              items={inProgressItems}
              teamMembers={teamMembers}
            />
            <KanbanLane
              projectId={projectId}
              title={t("board.kanban.completed.label")}
              items={completedItems}
              teamMembers={teamMembers}
            />
          </Flex>
        </Flex>
      </DndContext>
    </>
  );
};
export default KanbanBoard;
