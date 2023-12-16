// Importing necessary Chakra UI and Dnd-kit components, icons, and utilities
import { Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import { FaPlus } from "react-icons/fa";
import EditWorkItemModel from "../EditWorkItemModel";
import { useState } from "react";
import * as projectService from "../../services/project-service";
import { setCurrentWorkItem } from "../../store/slices/workitem-slice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import WorkItem from "../../models/workitem";

// Props interface for KanbanLane component
interface Props {
  projectId: string;
  title: string;
  items: any[];
  teamMembers: any;
}


export default function KanbanLane({
  projectId,
  title,
  items,
  teamMembers,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  const dispatch: AppDispatch = useDispatch();
  const [workitems, setWorkitems] = useState<WorkItem[]>([]);
  const [selectedWorkItem, setSelectedWorkItem] = useState<any>();
  const [editWorkItem, setEditWorkItem] = useState(false);
  const [workitem, setWorkitem] = useState<WorkItem>();
  projectService.getWorkItemsByProjectId(projectId).then((p) => {
    p?.workitems?.forEach((workitem:any) => {
      setWorkitem(workitem);
      setWorkitems((workitems) => [...workitems, workitem]);
      dispatch(setCurrentWorkItem(workitem));
      setSelectedWorkItem(workitem);
      setSelectedWorkItem(workitem);
    });
  });

  return (
    <>
      <Flex flex="3" paddingRight="5" flexDirection="column" height="30rem">
        <Flex
          ref={setNodeRef}
          backgroundColor="gray.100"
          borderRadius="7"
          flex="1"
          flexDirection="column"
          overflowY="auto"
        >
          {/* Header section displaying the lane title and number of items */}
          <div className="sticky top-0 left-0 flex justify-between px-3 py-2.5 font-primary-light text-xs uppercase text-font-light duration-200 ease-in-out dark:text-font-light-dark ">
            <span className="flex gap-2">
              <span>{title}</span>
              <span>( {items.length} )</span>
            </span>
          </div>

          {/* Mapping through each work item in the lane and rendering KanbanCard */}
          {items.map((workitem, index) => (
            <KanbanCard
              title={title}
              workitem={workitem}
              key={workitem?._id}
              index={index}
              parent={title}
              teamMembers={teamMembers}
            />
          ))}
        </Flex>
      </Flex>
    </>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
