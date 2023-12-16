import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { HiOutlineViewBoards } from "react-icons/hi";
import { ImStatsDots } from "react-icons/im";
import { FaChessPawn } from "react-icons/fa";
import cx from "classix";
import Project from "../models/project";
import * as projectService from "../services/project-service";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectProjectById } from "../store/slices/project-slice";
import default_project_img from "../assets/default_project.svg";

// ProjectBoard component
const ProjectBoard = () => {
  //const error = useSelector((state: AppState) => state?.projects?.error);
  // State to store project details
  const [project, setProject] = useState<Project>();
  const currentProject = useSelector(selectProjectById);
  const { projectId } = useParams();

  // Fetch project details on component mount
  useEffect(() => {
    if (projectId) {
      projectService.getProjectById(projectId).then((project) => {
        setProject(project);
      });
    }
  }, [currentProject]);
  //const error = useSelector((state: AppState) => state?.projects?.error);
  // Render the component

  return (
    <>
      {/* Side navigation */}
      <div className="flex h-full w-64 flex-col bg-grey-100 shadow-inner bg-white py-2 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.3)]">
        {/* Project details section */}

        <div className="my-2 flex items-center gap-x-2 px-3">
          <div className="items-center justify-center rounded-sm text-xs font-bold text-white">
            {/* <FaChessPawn className="aspect-square text-2xl" /> */}
            <img
              className=" rounded-sm aspect-square w-full h-full object-cover"
              src={
                project?.projectImage
                  ? project?.projectImage
                  : default_project_img
              }
              alt={project?.name}
            />
          </div>
          <div>
            <h2 className="-mb-[0.5px] text-sm font-semibold text-gray-600">
              {project?.name}
            </h2>
            <p className="text-xs text-gray-500 font-primary-light text-sm leading-4 line-clamp-2">
              {project?.description ?? "Project Description"}
            </p>
          </div>
        </div>

        {/* Navigation section */}
        <div className="flex items-center">
          <section className="flex-grow p-3">
            <nav className="flex-grow">
              {navItems.map(({ href, name, icon, disabled }) => (
                <NavItem
                  key={href}
                  href={href}
                  icon={icon}
                  name={name}
                  disabled={disabled}
                />
              ))}
            </nav>
          </section>
        </div>
      </div>
      <Outlet />
    </>
  );
};

// Navigation item component
const NavItem = ({ href, icon, name, disabled }: NavItemProps): JSX.Element => {
  // Translation hook
  const { t } = useTranslation("common");

  // Render the navigation item
  return (
    <NavLink
      to={disabled ? "#" : href}
      className={({ isActive }) =>
        cx(
          "group flex w-full cursor-pointer items-center gap-4 rounded border-none p-2 text-sm",
          isActive && !disabled
            ? "bg-grey-300 text-primary-main dark:bg-dark-200 dark:text-primary-main-dark"
            : "text-font-light dark:text-font-main-dark",
          disabled
            ? " hover:bg-transparent"
            : "hover:bg-grey-300 dark:hover:bg-dark-100"
        )
      }
    >
      {icon}
      <span>{t(`board.button.${name}.label`)}</span>
    </NavLink>
  );
};

// Interface for navigation item props
export interface NavItemProps {
  href: string;
  icon: JSX.Element;
  name: string;
  disabled?: boolean;
}

// Navigation items array
const navItems: NavItemProps[] = [
  {
    href: "board",
    icon: <HiOutlineViewBoards size={24} />,
    name: "board",
  },
  {
    href: "settings",
    icon: <ImStatsDots size={20} />,
    name: "projectsettings",
  },
];
export default ProjectBoard;
