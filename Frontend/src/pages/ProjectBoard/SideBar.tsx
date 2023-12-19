import cx from "classix";
import { useTranslation } from "react-i18next";
import { HiOutlineViewBoards } from "react-icons/hi";
import { ImStatsDots } from "react-icons/im";
import { Link, NavLink, useParams } from "react-router-dom";
import project from "../../models/project";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Project from "../../models/project";
import { selectProjectById } from "../../store/slices/project-slice";
import * as projectService from "../../services/project-service";
import default_project_img from "../../../src/assets/logo.png";
import { RiArrowDropLeftLine } from "react-icons/ri";

const SideBar = () => {
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
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
//     <aside className="relative">
// <div
//       style={{ maxWidth: "20rem" }}
//       // className="mt-16 flex flex-col bg-grey-100 shadow-inner bg-white py-2 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.3)]"
//       className="mt-16 flex h-full max-w-0 flex-col whitespace-nowrap bg-grey-100 opacity-0 duration-300 ease-out dark:bg-dark-500 w-[240px] max-w-[240px] whitespace-normal opacity-100"
//     >
//       {/* Project details section */}
//       <section className="flex w-full items-start py-4 px-3">
//         <img
//           style={{ borderRadius: "15%" }}
//           className="p-3 aqua-square w-16 h-16 rounded-full object-cover"
//           src={
//             project?.projectImage ? project?.projectImage : default_project_img
//           }
//           alt={project?.name}
//         />
//         <div>
//           <p className="font-primary font-bold text-sm leading-4">{project?.name}</p>
//           <h1 className="text-sm mt-1 whitespace-normal font-primary-light text-sm leading-4 line-clamp-2">
//             {project?.description}
//           </h1>
//         </div>
//       </section>

//       {/* Navigation section */}
//       <div className="flex items-center">
//         <section className="flex-grow p-3">
//           <nav className="flex-grow">
//             {navItems.map(({ href, name, icon, disabled }) => (
//               <NavItem
//                 key={href}
//                 href={href}
//                 icon={icon}
//                 name={name}
//                 disabled={disabled}
//               />
//             ))}
//           </nav>
//         </section>
//       </div>
//     </div>
//     </aside>
<aside className="relative flex">
      <div
        className={cx( 
          "mt-16 flex h-full max-w-0 flex-col whitespace-nowrap bg-grey-100 opacity-0 duration-300 ease-out dark:bg-dark-500",
          isOpen && "w-[300px] max-w-[300px] whitespace-normal opacity-100"
        )}
      >
        <section className="flex w-full items-start py-6 px-3">
          <img
            src={project?.projectImage ? project?.projectImage : default_project_img
            }
            width={45}
            height={45}
            alt="project"
            className="rounded-[3px]"
          />
          <div className="ml-2 w-full">
            <p className="font-bold text-sm leading-4">{project?.name}</p>
            <p className="mt-2 whitespace-normal text-sm leading-4 line-clamp-2">
              {project?.description}
            </p>
          </div>
        </section>
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
      <div
        className={cx("r-0 relative z-10 ml-0 h-full w-3", isOpen && "ml-0")}
      >
        <div className="absolute -left-[3px] h-full w-[3px] bg-gradient-to-l from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.0)] opacity-50" />
        <button
          onClick={toggleSidebar}
          className={cx(
            "absolute -left-[12px] mt-36 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full border-none bg-white shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)] transition-transform delay-150 duration-200 ease-in hover:bg-primary-main hover:text-white dark:bg-dark-200 dark:hover:bg-dark-100",
            !isOpen && "rotate-180"
          )}
          aria-label="Toggle sidebar"
        >
          <RiArrowDropLeftLine size={24} />
        </button>
      </div>
    </aside>
    
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

export default SideBar;
