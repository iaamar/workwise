// Importing necessary dependencies and components
import React, { useEffect, useState } from "react";
import Model from "./Model";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectUsers } from "../store/slices/user-slice";
import CustomSelect from "./CustomSelect";
import { MdDeleteOutline } from "react-icons/md";
import * as AlertDialog from "../components/AlertDialog";
import { TextArea } from "./TextArea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Input from "./Input";
import { AppDispatch } from "../store/store";
import { createNewProject } from "../store/slices/project-slice";
import { StylesConfig } from "react-select";
import WorkItem from "../models/workitem";
import TextareaAutosize from "react-textarea-autosize";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import {
  FaCheckSquare,
  FaBookmark,
  FaExclamationCircle,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

// Importing constants, utilities, and slices from the store
import {
  WorkItemType,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemStatusCopy,
} from "../constants/WorkItem";
import { set } from "lodash";
import {
  createNewWorkItem,
  editWorkItem,
} from "../store/slices/workitem-slice";
import {
  formatDateTime,
  formatDateTimeConversational,
} from "../utils/formatDates";
import CommentsSection from "./Comment/CommentsSection";
import {
  commentsFetched,
  deleteComment,
  selectComments,
  updateComment,
} from "../store/slices/comment-slice";
import { createComment } from "../store/slices/comment-slice";
import { deleteWorkItem } from "../store/slices/workitem-slice";
import TasksSection from "./Task/TasksSection";
import { selectTasks, tasksFetched } from "../store/slices/task-slice";
import { useTranslation } from "react-i18next";

// Interface definition for component props
interface Props {
  onClose: () => void;
  workItem?: WorkItem;
  teamMembers?: Array<any>;
}

// Default work item values
const defaultWorkItem = {
  title: "",
  description: "",
  priority: "medium",
  status: "backlog",
  type: "story",
  estimatedCompletionTime: 0,
  assignees: [],
};

// EditWorkItemModel component definition
const EditWorkItemModel = (props: Props) => {
  const { onClose, workItem, teamMembers } = props;
  const [selectedReporter, setSelectedReporter] = useState<any>([]);
  const [createTask, setCreateTask] = useState<boolean>(false);

  const users = useSelector(selectUsers);

  const storeComments = useSelector(selectComments);
  const storeTasks = useSelector(selectTasks);
  const assignees = teamMembers
    ? teamMembers.map((user) => ({
        value: user?._id,
        label: `${user?.firstName} ${user?.lastName}`,
        avatar: user?.photoURL,
        isFixed: false,
      }))
    : [];

  // Dispatch function from Redux
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [workItemState, setWorkItem] = useState<WorkItem>(
    workItem || defaultWorkItem
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const workItemStatusOptions = [
    {
      value: "backlog",
      label: "Backlog",
      bgcolor: "#DFE1E6",
      color: "#42526E",
    },
    {
      value: "selected",
      label: "Selected For Development",
      bgcolor: "#DFE1E6",
      color: "#42526E",
    },
    {
      value: "inprogress",
      label: "In Progress",
      bgcolor: "#0052CC",
      color: "white",
    },
    {
      value: "completed",
      label: "Completed",
      bgcolor: "#0B875B",
      color: "white",
    },
  ];
  const workItemPriorityOptions = [
    {
      value: "lowest",
      label: "Lowest",
      color: "#172B4D",
    },
    {
      value: "low",
      label: "Low",
      color: "#172B4D",
    },
    {
      value: "medium",
      label: "Medium",
      color: "#172B4D",
    },
    {
      value: "high",
      label: "High",
      color: "#172B4D",
    },
    {
      value: "highest",
      label: "Highest",
      color: "#172B4D",
    },
  ];

  const workItemTypeOptions = [
    {
      value: "story",
      label: "Story",
      color: "#172B4D",
    },
    {
      value: "feature",
      label: "Feature",
      color: "#172B4D",
    },
    {
      value: "bug",
      label: "Bug",
      color: "#172B4D",
    },
  ];

  // Fetching initial data on component mount or when work item changes
  useEffect(() => {
    dispatch(commentsFetched(workItem?.comments ?? []));
    dispatch(tasksFetched(workItem?.tasks ?? []));
    setTitle(workItem?.title ?? "");
    setDescription(workItem?.description ?? "");
    const assignedMembers = workItem?.assignees
      ? workItem?.assignees?.map((user) => {
          if (typeof user === "string") {
            return null; // or handle the case when user is a string
          }
          return {
            value: user?._id ?? "",
            label: `${user?.firstName} ${user?.lastName}`,
            avatar: user?.photoURL,
            isFixed: false,
          };
        })
      : [];
    if (users) {
      const reporter = users.find((user) => user._id === workItem?.ownerId);
      console.log("reporter", reporter);
      if (reporter) {
        setSelectedReporter([
          {
            value: reporter?._id,
            label: `${reporter?.firstName} ${reporter?.lastName}`,
            avatar: reporter?.photoURL,
            isFixed: false,
          },
        ]);
      }
    }
    setSelectedAssignees(assignedMembers);
    setSelectedStatus([
      workItemStatusOptions.find((option) => option.value === workItem?.status),
    ]);
    setSelectedType([
      workItemTypeOptions.find((option) => option.value === workItem?.type),
    ]);
    setSelectedPriority([
      workItemPriorityOptions.find(
        (option) => option.value === workItem?.priority
      ),
    ]);
  }, [workItem]);

  useEffect(() => {}, [storeComments]);

  useEffect(() => {}, [storeTasks]);
  interface Option {
    value: string;
    label: string;
    avatar?: string;
    isFixed?: boolean;
    color?: string;
  }

  const styles: StylesConfig<Option, true> = {
    multiValue: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, backgroundColor: "#868e96" }
        : { ...base, backgroundColor: "#e9ecef" };
    },
    multiValueLabel: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, display: "none" }
        : {
            ...base,
            backgroundColor: "transparent",
            ":hover": { backgroundColor: "transparent" },
          };
    },
  };

  const itemTypeStyles: StylesConfig<Option, true> = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.color,
      // margin: "0 0 10px 5px",
      backgroundColor: state.isSelected ? "transparent" : "white",
      "&:hover": {
        backgroundColor: "#edf2ff",
      },
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
    }),
    singleValue: (provided: any, state: any) => {
      const color = state.data.color;
      return { ...provided, color };
    },
    menu: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
    }),
  };

  const itemPriorityStyles: StylesConfig<Option, true> = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.color,

      backgroundColor: state.isSelected ? "transparent" : "white",
      "&:hover": {
        backgroundColor: "#edf2ff",
      },
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
    }),
    singleValue: (provided: any, state: any) => {
      const color = state.data.color;
      return { ...provided, color, backgroundColor: "transparent" };
    },
  };

  const itemStatusStyles: StylesConfig<Option, true> = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.color,
      backgroundColor: state.data.bgcolor,
      borderRadius: 5,
      outline: "none",
      margin: "0 0 10px 5px",
      padding: "3px 9px 3px 0",
      fontWeight: "600",
      width: "fit-content",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
      padding: "10px",
    }),
    singleValue: (provided: any, state: any) => {
      return {
        ...provided,
        color: state.data.color,
        backgroundColor: state.data.bgcolor,
        borderRadius: 5,
        outline: "none",
        margin: "0",
        padding: "3px 9px 3px 0",
        fontWeight: "600",
        width: "fit-content",
      };
    },
  };

  //const isClearable = options.some((v) => !v.isFixed) && options.length > 1;
  // Function to handle editing a work item
  const handleEditWorkItem = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await dispatch(
      editWorkItem({
        ...workItemState,
        lastUpdatedAt: new Date(),
        title,
        description,
      })
    );
    onClose();
  };

  const handleAddAssignees = (selectedOptions: any) => {
    console.log("selectedOptions", selectedOptions);
    setSelectedAssignees(selectedOptions);
    const assigneeIds = selectedOptions.map((option: any) => option.value);
    setWorkItem((prev) => ({ ...prev, assignees: assigneeIds }));
  };

  const handleStatusChange = (selectedStatus: any) => {
    console.log("selectedStatus", selectedStatus);
    setSelectedStatus(selectedStatus);
  };

  const [selectedAssignees, setSelectedAssignees] = useState<any>([]);

  const [selectedStatus, setSelectedStatus] = useState<any>(["backlog"]);

  const [selectedType, setSelectedType] = useState<any>([
    {
      value: "story",
      label: "Story",
      color: "#172B4D",
    },
  ]);

  const [selectedPriority, setSelectedPriority] = useState<any>([
    {
      value: "medium",
      label: "Medium",
      color: "#172B4D",
    },
  ]);

  const typeIcon = [
    {
      type: WorkItemType.FEATURE,
      size: 20,
      fill: "#4BADE8",
      icon: FaCheckSquare,
    },
    {
      type: WorkItemType.STORY,
      size: 20,
      fill: "#65ba43",
      icon: FaBookmark,
    },
    {
      type: WorkItemType.BUG,
      size: 20,
      fill: "#e44d42",
      icon: FaExclamationCircle,
    },
  ];

  const handleTypeChange = (selectedType: any) => {
    console.log("selectedType", selectedType);
    setSelectedType(selectedType);
    setWorkItem((prev) => ({ ...prev, type: selectedType.value }));
  };
  const handlePriorityChange = (selectedPriority: any) => {
    console.log("selectedPriority", selectedPriority);
    setSelectedPriority(selectedPriority);
    setWorkItem((prev) => ({ ...prev, priority: selectedPriority.value }));
  };

  const handleAddComment = async (commentText: string) => {
    await dispatch(
      createComment({
        description: commentText,
        workItemId: workItem?._id,
        authorId: currentUser?._id,
      })
    );
  };

  const handleEditComment = (index: number, commentText: string) => {
    console.log("commentText", commentText);
    console.log("comment---to update", storeComments[index]);
    dispatch(
      updateComment({ ...storeComments[index], description: commentText })
    );
  };

  const handleChangeReporter = (selectedReporter: any) => {
    console.log("selectedReporter", selectedReporter);
    setSelectedReporter(selectedReporter);
  };

  const handleDeleteComment = (index: number) => {
    console.log("index", index);
    console.log("comment---to delete", storeComments[index]);
    dispatch(deleteComment(storeComments[index]._id));
  };

  const handleDeleteWorkItem = async () => {
    await dispatch(deleteWorkItem(workItem?._id ?? ""));
    onClose();
  };

  const handleAddTask = async (taskText: string) => {
    console.log("taskText", taskText);
  };

  const handleEditTask = (index: number, taskText: string) => {
    console.log("taskText", taskText);
  };

  const handleDeleteTask = (index: number) => {
    console.log("index", index);
  };

  const { t } = useTranslation("common");

  // Rendering the component
  return (
    <>
      <Model {...{ onClose }}>
        <>
          <div className="my-4 flex flex-row justify-between items-start">
            <p className="text-base font-semibold flex flex-row gap-2 items-center">
              {workItem?.workitemId?.toLowerCase().includes("story") ? (
                <FaCheckSquare fill="#4BADE8" size={20} />
              ) : null}
              {workItem?.workitemId?.toLowerCase().includes("feature") ? (
                <FaBookmark fill="#65ba43" size={20} />
              ) : null}
              {workItem?.workitemId?.toLowerCase().includes("bug") ? (
                <FaExclamationCircle fill="#e44d42" size={20} />
              ) : null}
              {workItem?.workitemId}
            </p>
            <div className="flex flex-row gap-4 justify-evenly items-center">
              {workItem && workItem?.tasks?.length === 0 ? (
                // <div
                //   onClick={() => setCreateTask(true)}
                //   className="cursor-pointer"
                // >
                //   {t("workitem.button.createtask.label")}
                // </div>
                <div style={{ width: "160px" }}>
                  <button
                    onClick={() => setCreateTask(true)}
                    className="btn w-full align-middle flex items-center rounded bg-grey-100 hover:bg-grey-200  p-3 hover:bg-primary-light hover:text-grey-900 dark:bg-dark-200 dark:hover:bg-dark-100 text-medium"
                  >
                    <span>
                      <FaTasks size={22} />
                    </span>
                    <span className="ml-2 leading-4">
                      {t("workitem.button.createtask.label")}
                    </span>
                  </button>
                </div>
              ) : null}

              <AlertDialog.Root>
                <AlertDialog.Trigger
                  className={
                    "flex align-center items-center gap-1 cursor-pointer border-none text-sm mt-1 text-icon dark:text-font-light-dark hover:text-error-main dark:hover:text-error-main-dark"
                  }
                  aria-label="Open delete issue dialog"
                  title={t("workitem.button.deleteworkitem.hover")}
                >
                  <RiDeleteBinLine size={30} className="cursor-pointer" />
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                  <AlertDialog.Overlay
                    className={AlertDialog.alertDialogOverlayClass}
                  />
                  <AlertDialog.Content
                    className={AlertDialog.alertDialogContentClass}
                  >
                    <AlertDialog.Title
                      className={AlertDialog.alertDialogTitleClass}
                    >
                      {t("workitem.deleteworkitem.dialog.title")}
                    </AlertDialog.Title>
                    <AlertDialog.Description
                      className={AlertDialog.alertDialogDescriptionClass}
                    >
                      {t("workitem.deleteworkitem.dialog.content")}
                    </AlertDialog.Description>
                    <div
                      style={{
                        display: "flex",
                        gap: 25,
                        justifyContent: "flex-end",
                      }}
                    >
                      <AlertDialog.Cancel
                        className={
                          AlertDialog.buttonBaseClass +
                          AlertDialog.alertDialogCancelClass
                        }
                        asChild
                      >
                        <button className="Button mauve bg-grey-300 hover:bg-grey-400">
                          {t("cancel.label")}
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action
                        className={
                          AlertDialog.buttonBaseClass +
                          AlertDialog.alertDialogConfirmClass
                        }
                        asChild
                      >
                        <button
                          className="Button hover:bg-error-600 hover:text-white"
                          onClick={handleDeleteWorkItem}
                        >
                          {t("workitem.button.deleteworkitem.label")}
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
              <RiCloseLine
                size={38}
                onClick={onClose}
                className="cursor-pointer"
              />
            </div>
          </div>
          <form onSubmit={handleEditWorkItem} className="h-full">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-3/5 gap-2">
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.input.summary.label")}
                  </label>
                  <TextareaAutosize
                    minRows={1}
                    maxRows={3}
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    className="w-full font-semibold p-1 border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2 rounded-md custom-textarea"
                    placeholder={t("workitem.input.summary.placeholder")}
                  />
                </div>
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.input.description.label")}
                  </label>
                  {/* <TextArea
                    name="description"
                    value={description}
                    setValue={(value) => setDescription(value)}
                    placeholder="Describe the issue in as much detail as you'd like."
                  /> */}
                  <TextareaAutosize
                    minRows={2}
                    maxRows={3}
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    className="w-full p-1 font-light rounded-sm hover:bg-grey-100 hover:cursor-pointer custom-textarea "
                    placeholder={t("workitem.input.description.placeholder")}
                  />
                </div>
                <div>
                  {createTask || storeTasks?.length ? (
                    <TasksSection
                      tasks={storeTasks ?? []}
                      assignees={assignees}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      ownerId={currentUser?._id ?? ""}
                      workItemId={workItem?._id ?? ""}
                      isTaskEmpty={storeTasks?.length === 0}
                    />
                  ) : null}
                </div>
                <div>
                  <CommentsSection
                    comments={storeComments ?? []}
                    onAddComment={handleAddComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                  />
                </div>
              </div>

              <div className="flex flex-col w-2/5 gap-3">
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.input.workitemtype.label")}
                  </label>
                  <CustomSelect
                    selectedOptions={selectedType}
                    options={workItemTypeOptions}
                    onChange={handleTypeChange}
                    isMulti={false}
                    customStyles={itemTypeStyles}
                    includeIcon={false}
                    isClearable={false}
                    customComponent={typeIcon}
                  />
                </div>
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.priority.label")}
                  </label>
                  <CustomSelect
                    selectedOptions={selectedPriority}
                    options={workItemPriorityOptions}
                    onChange={handlePriorityChange}
                    isMulti={false}
                    customStyles={itemPriorityStyles}
                    includeIcon={false}
                    isClearable={false}
                  />
                </div>

                <div>
                  <label className="text-label font-medium">
                    {t("workitem.status.label")}
                  </label>
                  <CustomSelect
                    selectedOptions={selectedStatus}
                    options={workItemStatusOptions}
                    onChange={handleStatusChange}
                    isMulti={false}
                    customStyles={itemStatusStyles}
                    includeIcon={false}
                    isClearable={false}
                  />
                </div>
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.assignees.label")}
                  </label>
                  <CustomSelect
                    selectedOptions={selectedAssignees}
                    options={assignees}
                    onChange={handleAddAssignees}
                    isMulti={true}
                    customStyles={styles}
                    includeIcon={true}
                    isClearable={false}
                  />
                </div>
                <div>
                  <label className="text-label font-medium">
                    {t("workitem.reporter.label")}
                  </label>
                  <CustomSelect
                    selectedOptions={selectedReporter}
                    options={assignees}
                    onChange={handleChangeReporter}
                    isMulti={false}
                    customStyles={styles}
                    includeIcon={true}
                    isClearable={false}
                  />
                </div>
                <div
                  style={{ fontSize: "12px" }}
                  className="font-medium text-sm"
                >
                  <p>
                    {" "}
                    {t("workitem.createdat.label")} : &nbsp;
                    <span className="font-light">
                      {formatDateTime(workItem?.createdAt ?? new Date())}
                    </span>
                  </p>
                  <p>
                    {" "}
                    {t("workitem.updatedat.label")} : &nbsp;
                    <span className="font-light">
                      {formatDateTimeConversational(
                        workItem?.lastUpdatedAt ?? new Date()
                      )}
                    </span>
                  </p>
                </div>
                <div style={{ fontSize: "12px" }} className="font-light"></div>
              </div>
            </div>

            <div className="flex flex-row justify-end m-4">
              <button
                type="submit"
                className="bg-primary-900 text-white rounded-md py-2 px-4 hover:bg-primary-700"
              >
                {t("projectcard.button.save.label")}
              </button>
              {/* <button
                onClick={onClose}
                className="bg-grey-300 hover:bg-grey-400 ml-2 text-black rounded-md py-2 px-4"
              >
                {t("cancel.label")}
              </button> */}
            </div>
          </form>
        </>
      </Model>
    </>
  );
};

export default EditWorkItemModel;
