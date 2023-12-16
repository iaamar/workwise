// Importing necessary React components, hooks, and utilities
import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "../CustomSelect";
import TextareaAutosize from "react-textarea-autosize";
import { StylesConfig } from "react-select";
import Select from "react-select";
import Avatar from "react-avatar";
import { editTask } from "../../store/slices/task-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

// Props interface for the Task component
interface Props {
  task: any;
  assignees?: Array<any>;
}

// Interface for the Select component options
interface Option {
  value: string;
  label: string;
  avatar?: string;
  isFixed?: boolean;
  color?: string;
}

// Task component representing a single task in the application
function Task({ task, assignees = [] }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const ownerSelectStyles: StylesConfig<Option, true> = {
    control: (provided: any, state: any) => ({
      ...provided,

      boxShadow: "none",
      border: "none",
      outline: "none",
      width: "36px",
      height: "36px",
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
      height: "fit-content",
    }),
    singleValue: (provided: any, state: any) => {
      console.log("----single value", provided, state);
      return {
        ...provided,
        border: "none",
        width: "36px",
        height: "36px",
      };
    },
  };

  const statusSelectStyles: StylesConfig<Option, true> = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.color,
      backgroundColor: state.data.bgcolor,
      borderRadius: 5,
      outline: "none",
      margin: "0 0 10px 5px",
      padding: "3px 6px",
      fontWeight: "600",
      width: "fit-content",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      width: "fit-content",
      border: "none",
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      width: "90px",
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
        padding: "3px 6px",
        fontWeight: "600",
        width: "fit-content",
        textAlign: "center",
      };
    },
  };

  // State for managing task owner, status, description, and editing status
  const [taskOwner, setTaskOwner] = useState<any>(null);
  const [taskStatus, setTaskStatus] = useState<any>(null);
  const [taskDescription, setTaskDescription] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Options for task status select dropdown
  const taskStatusOptions = [
    {
      value: "todo",
      label: "TO DO",
      bgcolor: "#DFE1E6",
      color: "#42526E",
    },
    {
      value: "completed",
      label: "Done",
      bgcolor: "#0B875B",
      color: "white",
    },
  ];

  // Reference for textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // useEffect hook to set cursor position when editing task description
  useEffect(() => {
    if (isEditing) {
      textareaRef?.current?.setSelectionRange(
        taskDescription.length,
        taskDescription.length
      );
      textareaRef?.current?.focus();
    }
  }, [isEditing]);

  // useEffect hook to update state when task changes
  useEffect(() => {
    setTaskOwner({
      value: task.ownerId?._id,
      label: `${task.ownerId?.firstName} ${task.ownerId?.lastName}`,
      avatar: task.ownerId?.photoURL,
      isFixed: false,
    });
    setTaskStatus(() =>
      taskStatusOptions.find(
        (status) => status.value === (task?.completed ? "completed" : "todo")
      )
    );
    setTaskDescription(task.description);
  }, [task]);

  // Handle owner change in the task
  const handleOwnerChange = (selectedOptions: any) => {
    setTaskOwner(selectedOptions);
    onEditTask({ ...task, newOwner: selectedOptions.value });
  };

  // Handle task editing
  const handleTaskEdit = () => {
    setIsEditing(true);
  };

  // Handle status change in the task
  const handleStatusChange = (selectedOptions: any) => {
    setTaskStatus(selectedOptions);
    onEditTask({ ...task, completed: selectedOptions.value === "completed" });
  };

  // Function to handle task editing and dispatch the updated task
  const onEditTask = (task: any) => {
    const updatedTask = {
      _id: task?._id,
      ownerId: task?.newOwner ? task?.newOwner : task?.ownerId?._id,
      completed: task?.completed,
      description: taskDescription,
    };
    dispatch(editTask(updatedTask));
  };

  // Handle key down event in the task description textarea
  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      onEditTask({ ...task, description: taskDescription });
      setIsEditing(false);
      // Save the task description here (e.g., call an API to update the task)
      // You can add your save logic based on your application's requirements
    }
  };

  // Format label for options in the owner select dropdown
  const formatOptionLabel = (value: Option) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar size="30" round src={value.avatar} />
      <span style={{ marginLeft: "10px" }}>{value.label}</span>
    </div>
  );

  // Format selected option in the owner select dropdown
  const formatSelectedOption = ({ data }: any) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar size="30" round src={data?.avatar} />
      </div>
    );
  };

  // Render the Task component
  return (
    <div
      style={{ height: "46px" }}
      className="flex flex-row justify-between items-center border gap-0 pr-2"
    >
      {isEditing ? (
        <div
          style={{
            width: "75%",
            borderWidth: "1px",
            borderColor: "#364fc7",
            boxSizing: "border-box",
          }}
        >
          <TextareaAutosize
            maxRows={1}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            className="rounded-sm w-full h-full custom-textarea fit-content border-none p-2 taskInput"
            ref={textareaRef}
          />
        </div>
      ) : (
        <div onClick={handleTaskEdit} className=" p-2" style={{ width: "75%" }}>
          {taskDescription}
        </div>
      )}
      <div
        className="flex  grow-1 flex-row-reverse justify-between items-center"
        style={{ width: "20%", flexGrow: 1 }}
      >
        <div style={{ width: "20%" }}>
          <img
            src={task.ownerId?.photoURL}
            alt="owner"
            className="rounded-full w-6 h-6"
          />
        </div>

        <div style={{ width: "fit-content" }}>
          <Select
            isDisabled={false}
            isClearable={false}
            isSearchable={false}
            options={taskStatusOptions}
            value={taskStatus}
            onChange={(selectedOptions: any) =>
              handleStatusChange(selectedOptions)
            }
            closeMenuOnSelect={true}
            styles={statusSelectStyles}
            className="custom-multi-select"
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Task;
