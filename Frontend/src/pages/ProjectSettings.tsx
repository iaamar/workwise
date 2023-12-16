import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectUsers } from "../store/slices/user-slice";
import CustomSelect from "../components/CustomSelect";
import { TextArea } from "../components/TextArea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Input from "../components/Input";
import { AppDispatch } from "../store/store";
import {
  createNewProject,
  deleteProject,
  updateProject,
} from "../store/slices/project-slice";
import { StylesConfig } from "react-select";
import { Link, Navigate, useParams } from "react-router-dom";
import * as projectService from "../services/project-service";
import * as userService from "../services/user-service";
import User from "../models/user";
import default_project_img from "../assets/default_project.svg";
import * as AlertDialog from "../components/AlertDialog";
import { min, set } from "lodash";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Project from "../models/project";
import { UserAvatar } from "../components/UserAvatar";
import Avatar from "react-avatar";
import { MdDeleteOutline } from "react-icons/md";
import { text } from "stream/consumers";
import { render } from "@testing-library/react";

// ProjectSettings component
const ProjectSettings = () => {
  // Extracting projectId from route parameters
  const { projectId } = useParams();

  // Current user details from Redux store
  const currentUser = useSelector(selectCurrentUser);

  // Redux dispatch function
  const dispatch: AppDispatch = useDispatch();

  // State variables for managing form inputs
  const [isCurrentUserTheOwner, setIsCurrentUserTheOwner] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectOwnerId, setProjectOwnerId] = useState("");
  const [projectOwnerUser, setProjectOwnerUser] = useState<User>();
  const [project, setProject] = useState<Project>();
  const isUserTheProjectOwner = isCurrentUserTheOwner;

  // Fetch project details on component mount
  console.log("projectOwnerUser", projectOwnerUser);
  useEffect(() => {
    console.log(projectId);

    projectService.getProjectById(projectId ?? "").then(async (project) => {
      console.log("project", project);
      if (project) {
        // Update state with project details
        setProject(project);
        setProjectName(project.name);
        setDescription(project.description);
        setStartDate(new Date(project.startDate ?? ""));
        setEndDate(new Date(project.endDate ?? ""));
        setProjectOwnerUser(
          await userService.getUserId(project.projectOwnerId.toString())
        );
        console.log(
          "project.teamMembers",
          project?.projectOwnerId === currentUser?._id
        );

        // Convert team members to the required format for the CustomSelect component
        const teamMembers =
          project.teamMembers?.map((member) => ({
            value: (member as User)?._id,
            label: `${(member as User)?.firstName} ${
              (member as User)?.lastName
            }`,
            avatar: (member as User)?.photoURL,
            isFixed: (member as User)?._id === project.projectOwnerId,
          })) ?? [];
        setSelectedUsers(teamMembers);

        // Check if the current user is the owner of the project
        if (project?.projectOwnerId === currentUser?._id) {
          setIsCurrentUserTheOwner(true);
        }
      }
    });
  }, [projectId, currentUser?._id]);

  // Status options for the project
  const statusOptions = [
    { value: "backlog", label: "Backlog", color: "black" },
    { value: "selected", label: "Selected", color: "blue" },
    { value: "in-progress", label: "In Progress", color: "red" },
    { value: "done", label: "Done", color: "green" },
  ];

  // Interface for CustomSelect options
  interface Option {
    value: string;
    label: string;
    avatar: string;
    isFixed?: boolean;
    color?: string;
  }

  // Styles configuration for the CustomSelect component
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

  // Custom styles configuration for the CustomSelect component
  const customStyles: StylesConfig<Option, true> = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.data.color, // Set the text color based on the 'color' property of the option
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      width: "100%",
    }),
    singleValue: (provided: any, state: any) => {
      const color = state.data.color;
      return { ...provided, color };
    },
  };

  // Set minimum end date when component mounts
  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() + 100));
    setEndDate(endDate);
  }, []);

  // State variables for managing selected users and options
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([
    {
      value: currentUser?._id,
      label: `${currentUser?.firstName} ${currentUser?.lastName}`,
      avatar: currentUser?.photoURL,
      isFixed: true,
    },
  ]);

  // Select users from Redux store
  const users = useSelector(selectUsers);

  // Create options from users excluding the current user
  const options = users
    .map((user) => ({
      value: user?._id,
      label: `${user?.firstName} ${user?.lastName}`,
      avatar: user?.photoURL,
      isFixed: false,
    }))
    .filter((user) => user.value !== currentUser?._id);

  // Determine if the CustomSelect should be clearable
  const isClearable = options.some((v) => !v.isFixed) && options.length > 1;

  // Handle form submission to update the project
  const handleUpdateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("selectedUsers", selectedUsers);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("description", description);
    console.log("name", projectName);

    // Create project object with updated information
    const teamMembers = selectedUsers.map((user) => user.value);
    const project = {
      name: projectName,
      description,
      startDate,
      endDate,
      teamMembers,
      projectOwnerId: currentUser?._id || "",
    };
    console.log("project", project);

    // Dispatch updateProject action with the updated project
    try {
      await dispatch(updateProject({ ...project, _id: projectId }));
      toast.success(t("projectseettings.toast.success.label"));
    } catch (error) {
      toast.error(t("projectseettings.toast.error.label"));
    }
  };

  // Handle user selection in the CustomSelect component
  const handleUserSelect = (selectedUsers: any) => {
    console.log("selectedUsers", selectedUsers);
    setSelectedUsers(selectedUsers);
  };

  // Update description in the state
  const updateDescription = (value: string) => {
    setDescription(value);
  };

  // Handlers for start and end date selection and change
  const handleStartDateSelect = (date: Date) => {
    setStartDate(date);
  };
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };
  const handleEndDateSelect = (date: Date) => {
    setEndDate(date);
  };
  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  // Handle project name change
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(event.target.value);
  };

  // Calculate and return minimum end date based on start date
  const handleMinEndDate = () => {
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    return minEndDate;
  };
  const deleteProjectById = async () => {
    dispatch(deleteProject(project?._id ?? ""));
  };
  const { t } = useTranslation("common");

  const readOnly = false;

  return (
    <div className="p-3 max-w-3xl mx-auto">
      <form
        onSubmit={handleUpdateProject}
        className="flex flex-col justify-between gap-10 m-5"
      >
        {/* Project Name Input */}
        <div>
          <label className="text-label font-medium">
            {t("projectcard.input.projectname.label")}
          </label>
          <TextareaAutosize
            minRows={1}
            maxRows={2}
            value={projectName}
            onChange={(e: any) => setProjectName(e.target.value)}
            className="w-full p-2 font-medium rounded-md hover:cursor-pointer custom-textarea border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2"
            placeholder={t("projectcard.input.projectname.placeholder")}
            required={true}
            disabled={!isCurrentUserTheOwner}
          />
        </div>

        {/* Project Description Input */}
        <div>
          <label className="text-label font-medium">
            {t("projectcard.input.description.label")}
          </label>
          <TextareaAutosize
            minRows={4}
            maxRows={6}
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            className="w-full p-2 font-light rounded-md hover:cursor-pointer custom-textarea border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2"
            placeholder={t("projectcard.input.description.placeholder")}
          />
        </div>

        {/* Project Members CustomSelect */}
        <div>
          <label className="text-label font-medium">
            {t("projectcard.input.owner.label")}
          </label>
          <section className="p-2">
            <Avatar size="30" round src={projectOwnerUser?.photoURL} />
            <span style={{ marginLeft: "10px", background: "transparent" }}>
              {projectOwnerUser?.firstName + "" + projectOwnerUser?.lastName}
            </span>
          </section>
        </div>
        <div>
          <label className="text-label font-medium">
            {t("projectcard.input.members.label")}
          </label>
          <CustomSelect
            selectedOptions={selectedUsers}
            options={options}
            onChange={handleUserSelect}
            isMulti={true}
            customStyles={styles}
            includeIcon={true}
            isClearable={false}
            disabled={!isCurrentUserTheOwner}
          />
        </div>

        {/* End Date Picker */}
        <div className="flex justify-evenly">
          <div>
            <label className="text-label font-medium p-3">
              {t("projectcard.input.startdate.label")}
            </label>
            <DatePicker
              selected={startDate}
              onSelect={handleStartDateSelect} //when day is clicked
              onChange={handleStartDateChange} //only when value has changed
              className="custom-datepicker-style rounded"
              disabled={!isCurrentUserTheOwner}
              minDate={startDate}
              dateFormat={"MMM d, yyyy"}
            />
          </div>

          {/* End Date Picker */}
          <div>
            <label className="text-label font-medium p-3">
              {t("projectcard.input.enddate.label")}
            </label>
            <DatePicker
              selected={endDate}
              onSelect={handleEndDateSelect} //when day is clicked
              onChange={handleEndDateChange} //only when value has changed
              className="custom-datepicker-style rounded"
              disabled={!isCurrentUserTheOwner}
              minDate={handleMinEndDate()}
              dateFormat={"MMM d, yyyy"}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-primary-900 text-white rounded hover:bg-primary-700 focus:outline-none focus:shadow-outline-primary-300 active:bg-primary-800"
            type="submit"
          >
            {t("projectcard.button.save.label")}
          </button>
        </div>
      </form>
      <AlertDialog.Root>
        {isUserTheProjectOwner ? (
          <AlertDialog.Trigger
            className={
              "flex align-center items-center gap-1 cursor-pointer border-none text-sm mt-1" +
              `${
                !isUserTheProjectOwner
                  ? "text-icon dark:text-font-light-dark text-opacity-50 dark:text-opacity-40 cursor-not-allowed"
                  : "text-icon dark:text-font-light-dark hover:text-error-main dark:hover:text-error-main-dark"
              }`
            }
            aria-label="Open delete issue dialog"
            title={t("projectcard.button.deleteproject.hover")}
            disabled={!isUserTheProjectOwner}
          >
            <MdDeleteOutline size={15} className="inline" />
            {t("projectcard.button.deleteproject.label")}
          </AlertDialog.Trigger>
        ) : null}

        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={AlertDialog.alertDialogOverlayClass}
          />
          <AlertDialog.Content className={AlertDialog.alertDialogContentClass}>
            <AlertDialog.Title className={AlertDialog.alertDialogTitleClass}>
              {t("projectcard.deleteproject.dialog.title")}
              {t("projectcard.deleteproject.dialog.title")}
            </AlertDialog.Title>
            <AlertDialog.Description
              className={AlertDialog.alertDialogDescriptionClass}
            >
              {t("projectcard.deleteproject.dialog.content")}
            </AlertDialog.Description>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialog.Cancel
                className={
                  AlertDialog.buttonBaseClass +
                  AlertDialog.alertDialogCancelClass
                }
                asChild
              >
                <button className="Button mauve">{t("cancel.label")}</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className={
                  AlertDialog.buttonBaseClass +
                  AlertDialog.alertDialogConfirmClass
                }
                asChild
              >
                <Link to="/projects">
                  <button className="Button red" onClick={deleteProjectById}>
                    {t("projectcard.button.deleteproject.label")}
                  </button>
                </Link>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};
export default ProjectSettings;
