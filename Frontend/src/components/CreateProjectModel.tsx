// Importing necessary dependencies and components
import React, { useEffect, useState } from "react";
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
import { RiCloseLine } from "react-icons/ri";
import { min } from "lodash";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/formatDates";

// Props interface definition
interface Props {
  onClose: () => void;
}

// CreateProjectModel component definition
const CreateProjectModel = (props: Props) => {
  const { onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // State for managing form inputs
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<any[]>([]);

  // Options for the status dropdown
  const statusOptions = [
    { value: "backlog", label: "Backlog", color: "black" },
    { value: "selected", label: "Selected", color: "blue" },
    { value: "in-progress", label: "In Progress", color: "red" },
    { value: "done", label: "Done", color: "green" },
  ];

  // Styles for the dropdown components
  interface Option {
    value: string;
    label: string;
    avatar: string;
    isFixed?: boolean;
    color?: string;
  }

  const styles: StylesConfig<Option, true> = {
    multiValue: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, backgroundColor: "#495057" }
        : { ...base, backgroundColor: "#e9ecef" };
    },
    multiValueLabel: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "medium", color: "white", paddingRight: 6 }
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

  const handleStatusChange = (selectedStatus: any) => {
    console.log("selectedStatus", selectedStatus);
    setSelectedStatus(selectedStatus);
  };

  // Effect to set default end date
  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() + 100));
    setEndDate(endDate);
  }, []);
  const handleDateSelect = (date: Date) => {
    setStartDate(date);
  };
  const handleDateChange = (date: Date) => {
    setStartDate(date);
  };
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([
    {
      value: currentUser?._id,
      label: `${currentUser?.firstName} ${currentUser?.lastName}`,
      avatar: currentUser?.photoURL,
      isFixed: true,
    },
  ]);
  const users = useSelector(selectUsers);
  const options = users
    .map((user) => ({
      value: user?._id,
      label: `${user?.firstName} ${user?.lastName}`,
      avatar: user?.photoURL,
      isFixed: false,
    }))
    .filter((user) => user.value !== currentUser?._id);

  const isClearable = options.some((v) => !v.isFixed) && options.length > 1;

  // Submit handler for creating a new project
  const handleCreateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("selectedUsers", selectedUsers);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("description", description);
    console.log();
    const teamMembers = selectedUsers.map((user) => user.value);
    console.log("assigneesIds", teamMembers);
    const project = {
      name: projectName,
      description,
      startDate,
      endDate,
      teamMembers,
      projectOwnerId: currentUser?._id || "",
    };
    try {
      await dispatch(createNewProject(project));
      onClose();
      toast.success(t("projects.toast.success.label"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(t("projects.toast.error.label"), error);
      toast.error(t("projects.toast.error.label"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleUserSelect = (selectedUsers: any) => {
    console.log("selectedUsers", selectedUsers);
    setSelectedUsers(selectedUsers);
  };
  const updateDescription = (value: string) => {
    setDescription(value);
  };
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
  const handleMinEndDate = () => {
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    return minEndDate;
  };
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(event.target.value);
  };
  const readOnly = false;
  const { t } = useTranslation("common");

  // Render the component UI
  return (
    <Model {...{ onClose }}>
      <form
        onSubmit={handleCreateProject}
        className="flex flex-col justify-between h-full gap-10 my-3"
      >
        <div>
          <div className="flex justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              {t("projectcard.button.createproject.label")}
            </h2>
            <button onClick={onClose} className="text-2xl" title="Close Button">
              <RiCloseLine size={38} />
            </button>
          </div>
          <div>
            <label className="text-label font-medium">
              {t("projectcard.input.projectname.label")}
            </label>
            <TextareaAutosize
              minRows={1}
              maxRows={2}
              value={projectName}
              onChange={(e: any) => setProjectName(e.target.value)}
              className="w-full p-1 rounded-md hover:cursor-pointer custom-textarea border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2"
              placeholder={t("projectcard.input.projectname.placeholder")}
              required={true}
            />
          </div>
          <div></div>
        </div>

        <div>
          <label className="text-label font-medium">
            {t("projectcard.input.description.label")}
          </label>
          <TextareaAutosize
            minRows={4}
            maxRows={6}
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            className="w-full p-1 font-light rounded-md hover:cursor-pointer custom-textarea border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2"
            placeholder={t("projectcard.input.description.placeholder")}
            required={true}
          />
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
          />
        </div>
        <div className="flex justify-evenly">
          <div>
            <label className="text-label font-medium p-3 ">
              {t("projectcard.input.startdate.label")}
            </label>
            <DatePicker
              selected={startDate}
              onSelect={handleStartDateSelect} //when day is clicked
              onChange={handleStartDateChange} //only when value has changed
              className="custom-datepicker-style rounded-md border"
              minDate={startDate}
              dateFormat="MMMM d, yyyy"
            />
          </div>

          <div>
            <label className="text-label font-medium p-3">
              {t("projectcard.input.enddate.label")}
            </label>
            <DatePicker
              selected={endDate}
              onSelect={handleEndDateSelect} //when day is clicked
              onChange={handleEndDateChange} //only when value has changed
              className="custom-datepicker-style rounded-md  border-grey-300"
              minDate={handleMinEndDate()}
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-primary-900 text-white rounded hover:bg-primary-700 focus:outline-none focus:shadow-outline-primary-300 active:bg-primary-800"
            type="submit"
          >
            {t("projectcard.button.createproject.label")}
          </button>
        </div>
      </form>
    </Model>
  );
};

export default CreateProjectModel;
