import Project from "../models/project";
import { Link, Form, useNavigate } from "react-router-dom";
import default_project_img from "../assets/default_project.svg";
import * as AlertDialog from "../components/AlertDialog";
import { MdDeleteOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import * as projectService from "../services/project-service";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import {
  deleteProject,
  fetchProjectDetails,
} from "../store/slices/project-slice";
import { useTranslation } from "react-i18next";
const ProjectCard = ({
  project,
  userId,
}: {
  project: Project;
  userId: string;
}): JSX.Element => {
  // const [isUserTheProjectOwner, setIsUserTheProjectOwner] = useState(false);
  // useEffect(() => {
  //   if (project.projectOwnerId === userId) {
  //     setIsUserTheProjectOwner(true);
  //   }
  // }, []);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const isUserTheProjectOwner = project.projectOwnerId === userId;

  const deleteProjectById = async () => {
    dispatch(deleteProject(project?._id ?? ""));
  };

  const onProjectClick = (project: any) => {
    dispatch(fetchProjectDetails(project));
    navigate(project._id + "/board");
  };

  return (
    <div
      onClick={() => onProjectClick(project)}
      className={
        "w-[400px]" +
        " " +
        "group flex rounded shadow-sm outline outline-2 outline-transparent duration-100 ease-linear" +
        "hover:-translate-y-0.5 hover:bg-primary-light hover:text-primary-main hover:shadow-md hover:outline-primary-main dark:bg-dark-200 dark:hover:text-primary-main-dark dark:hover:outline-primary-main-dark"
      }
    >
      <img
        src={project?.projectImage ?? default_project_img}
        alt="Project"
        width="90px"
        height="104px"
        className="h-auto w-[90px] rounded-l object-cover"
      />
      <div className="flex flex-col gap-1 px-3 pt-2 pb-6">
        <h2 className="text-xl font-bold text-black line-clamp-1">
          {project.name}
        </h2>
        <h3 className="min-h-[40px] font-primary-light text-sm text-font-light text-opacity-100 line-clamp-2 dark:text-white dark:text-opacity-60 dark:group-hover:text-primary-main-dark">
          {project.description}
        </h3>
      </div>
    </div>
  );
};

export default ProjectCard;
