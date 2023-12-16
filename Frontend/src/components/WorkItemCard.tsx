import React, { useState } from "react";
import CreateWorkItemModel from "./CreateWorkItemModel";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/user-slice";
import EditWorkItemModel from "./EditWorkItemModel";
import {
  FaCheckSquare,
  FaBookmark,
  FaExclamationCircle,
  FaArrowDown,
  FaArrowUp,
  FaPlus,
} from "react-icons/fa";
import {
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardDoubleArrowDown,
  MdArrowUpward,
} from "react-icons/md";
import { setCurrentWorkItem } from "../store/slices/workitem-slice";
import { AppDispatch } from "../store/store";

interface Props {
  workitems: any;
  teamMembers: any;
  projectId: string;
}

const WorkItemCard = ({ workitems, teamMembers, projectId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState<any>();
  const [editWorkItem, setEditWorkItem] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch: AppDispatch = useDispatch();
  const handleWorkItemModel = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="my-4">
        <button
          className="justify-evenly flex cursor-pointer items-center bg-primary-light text-xs dark:focus-visible:outline-white border-1 box-border h-[40px] w-[120px] rounded border-none bg-grey-100 outline outline-2 outline-grey-400 hover:bg-grey-300 "
          onClick={handleWorkItemModel}
        >
          <FaPlus /> Add WorkItem
        </button>
      </div>
      <div>
        {workitems?.map((workitem: any) => (
          <div
            onClick={() => {
              setEditWorkItem(true);
              dispatch(setCurrentWorkItem(workitem));
              setSelectedWorkItem(workitem);
            }}
            key={workitem?._id}
            className="container flex flex-col flex-wrap w-24 workitem-card mb-4 bg-primary-100 rounded-sm gap-3 px-4 py-3"
          >
            <div className="workitemName">{workitem.title}</div>
            <div className="workitemstatus flex flex-row justify-between items-center">
              <div className="itemId flex flex-row justify-between items-center gap-3">
                <div>
                  {workitem.workitemId.split("-")[0] === "STORY" ? (
                    <FaCheckSquare fill="#4BADE8" size={20} />
                  ) : null}
                  {workitem.workitemId.split("-")[0] === "FEATURE" ? (
                    <FaBookmark fill="#65ba43" size={20} />
                  ) : null}
                  {workitem.workitemId.split("-")[0] === "BUG" ? (
                    <FaExclamationCircle fill="#e44d42" size={20} />
                  ) : null}
                </div>
                <div>{workitem.workitemId}</div>
              </div>
              <div className="itemPriority">
                {workitem.priority === "highest" ? (
                  <MdKeyboardDoubleArrowUp fill="#cd1316" size={20} />
                ) : null}
                {workitem.priority === "high" ? (
                  <MdKeyboardArrowUp fill="#e94949" size={20} />
                ) : null}
                {workitem.priority === "medium" ? (
                  <MdArrowUpward fill="#e97f33" size={20} />
                ) : null}
                {workitem.priority === "low" ? (
                  <MdKeyboardArrowDown fill="#2d8738" size={20} />
                ) : null}
                {workitem.priority === "lowest" ? (
                  <MdKeyboardDoubleArrowUp fill="#57a55a" size={20} />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkItemCard;
