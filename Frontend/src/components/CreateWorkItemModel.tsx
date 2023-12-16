import React, { useEffect, useMemo, useState } from "react";
import Model from "./Model";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectUsers } from "../store/slices/user-slice";
import CustomSelect from "./CustomSelect";
import { TextArea } from "./TextArea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Input from "./Input";
import { AppDispatch } from "../store/store";
import { createNewProject } from "../store/slices/project-slice";
import { StylesConfig } from "react-select";
import WorkItem from "../models/workitem";
import {
  FaCheckSquare,
  FaBookmark,
  FaExclamationCircle,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

import {
  WorkItemType,
  WorkItemPriority,
  WorkItemStatus,
} from "../constants/WorkItem";
import { set } from "lodash";
import { createNewWorkItem } from "../store/slices/workitem-slice";
import { title } from "process";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
interface Props {
  onClose: () => void;
  teamMembers: Array<any>;
  projectId: string;
  ownerId: string;
}

// Default work item definition
const defaultWorkItem = {
  title: "",
  description: "",
  priority: "medium",
  status: "backlog",
  type: "story",
  estimatedCompletionTime: 0,
  assignees: [],
};

// CreateWorkItemModel component definition
const CreateWorkItemModel = (props: Props) => {
  const { onClose, teamMembers, projectId, ownerId } = props;
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [workItem, setWorkItem] = useState<WorkItem>(defaultWorkItem);

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
      boxShadow: "none",
      borderWidth: state.isFocused ? "2px" : provided.borderWidth,
      borderColor: state.focused ? "#364fc7" : provided.borderColor,
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
      width: "100%",
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

  // Assignees options
  const assignees = teamMembers
    ? teamMembers.map((user) => ({
        value: user?._id,
        label: `${user?.firstName} ${user?.lastName}`,
        avatar: user?.photoURL,
        isFixed: false,
      }))
    : [];

  //const isClearable = options.some((v) => !v.isFixed) && options.length > 1;

  // Event handler for creating a new work item
  const handleCreateWorkItem = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("workItem", workItem);
    await dispatch(createNewWorkItem({ ...workItem, projectId, ownerId }));
    onClose();
  };

  // Event handler for updating work item title
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setWorkItem((prev) => ({ ...prev, title: value }));
  };

  // Event handler for adding assignees
  const handleAddAssignees = (selectedOptions: any) => {
    console.log("selectedOptions", selectedOptions);
    setSelectedAssignees(selectedOptions);
    const assigneeIds = selectedOptions.map((option: any) => option.value);
    console.log("assigneeIds", assigneeIds);
    setWorkItem((prev) => ({ ...prev, assignees: assigneeIds }));
  };

  const handleStatusChange = (selectedStatus: any) => {
    console.log("selectedStatus", selectedStatus);
    setSelectedStatus(selectedStatus);
  };

  const [selectedAssignees, setSelectedAssignees] = useState<any>([]);

  const [selectedStatus, setSelectedStatus] = useState<any>([
    {
      value: "backlog",
      label: "Backlog",
      bgcolor: "#DFE1E6",
      color: "#42526E",
    },
  ]);

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

  const { t } = useTranslation("common");

  const readOnly = false;

  // Render the CreateWorkItemModel component
  return (
    <>
      <Model {...{ onClose }}>
        <>
          <div className="my-4 flex flex-row justify-between">
            <h3 className="text-xl font-semibold">
              {t("workitem.title.label")}
            </h3>
            <RiCloseLine
              size={32}
              onClick={onClose}
              className="cursor-pointer"
            />
          </div>
          <form
            onSubmit={handleCreateWorkItem}
            className="flex flex-col justify-between h-full gap-4"
          >
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
              <Input
                handleChange={(event: any) =>
                  setWorkItem((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                value={workItem?.title ? workItem?.title : ""}
                labelText={t("workitem.input.summary.label")}
                labelFor={"itemName"}
                id={"itemName"}
                name={"itemName"}
                type={"text"}
                isRequired={true}
                placeholder={t("workitem.input.summary.placeholder")}
                customClass={" rounded text-lg"}
              />
            </div>

            <div>
              <label className="text-label font-medium">
                {t("workitem.input.description.label")}
              </label>
              <TextArea
                name="description"
                value={workItem?.description ? workItem?.description : ""}
                setValue={(value) =>
                  setWorkItem((prev) => ({ ...prev, description: value }))
                }
                placeholder={t("workitem.input.description.placeholder")}
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

            <div className="flex flex-row justify-end mb-3">
              <button
                type="submit"
                className="bg-primary-900 text-white rounded-md py-2 px-4 hover:bg-primary-700"
              >
                {t("workitem.title.label")}
              </button>
            </div>
          </form>
        </>
      </Model>
    </>
  );
};

export default CreateWorkItemModel;
