import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link, Outlet } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllProjects,
  fetchProjects,
  projectsFetched,
} from "../store/slices/project-slice";
import { fetchUsers, selectCurrentUser } from "../store/slices/user-slice";
import CreateProjectModel from "../components/CreateProjectModel";
import { Search } from "../components/Search";
import Project from "../models/project";
import { useTranslation } from "react-i18next";

// ProjectsPage component
const ProjectsPage = () => {
  // Redux dispatch function and selector hooks
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const projects = useSelector(selectAllProjects);

  // State variables for loading status and modal visibility
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch projects and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("ProjectsPage useEffect");
      await dispatch(fetchProjects(currentUser?._id ?? "") as any); // Cast to 'any'
      await dispatch(fetchUsers() as any); // Cast to 'any'
      setLoading(false);
    };
    fetchData();
  }, [dispatch, currentUser?._id]);

  // Handler for project creation modal closure
  const handleProjectCreation = () => {
    setIsOpen(false);
  };

  // State variable to store the original list of projects
  const [originalProjects, setOriginalProjects] = useState<Project[]>([]);

  // Store the original projects when the component mounts
  useEffect(() => {
    setOriginalProjects(projects);
  }, []);

  // Search functionality to filter projects based on name
  const onSearch = (searchText: string) => {
    console.log("onSearch", originalProjects);
    if (searchText) {
      const filteredProjects = originalProjects.filter((project) =>
        project.name.toLowerCase().includes(searchText.toLowerCase())
      );
      dispatch(projectsFetched(filteredProjects));
    } else {
      dispatch(fetchProjects(currentUser?._id ?? "") as any);
    }
  };

  // Internationalization hook
  const { t } = useTranslation("common");

  // Render the ProjectsPage component
  return (
    <>
      <div
        className="bg-white dark:bg-dark-400"
        style={{ margin: "0 auto", padding: "3%" }}
      >
        {/* <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
          style={{ marginTop: '50px' }}
        /> */}
        <h1 className="font-primary-black text-3xl mb-5">
          {t("projects.title")}
        </h1>
        <div className="flex flex-row justify-between items-center space-x-4 mb-10">
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="btn flex w-fit items-center rounded bg-grey-300 hover:bg-grey-400  p-3 hover:bg-primary-light hover:text-primary-main dark:bg-dark-200 dark:hover:bg-dark-100 dark:hover:text-font-main-dark"
            >
              <span>
                <AiOutlinePlus size={22} />
              </span>
              <span className="ml-2 leading-4">
                {t("projects.button.addprojects")}
              </span>
            </button>
          </div>

          <div className="">
            <Search
              handleSearch={onSearch}
              placeholder={t("projects.input.filter.label")}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-16">
          {projects.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center font-2xl text-primary-900">
                {t("projects.info.no-projects")}
              </div>
            </div>
          ) : (
            projects?.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                userId={currentUser?._id ?? ""}
              />
            ))
          )}
        </div>
        <Outlet />
      </div>

      {/* CreateProjectModel modal */}
      {isOpen && <CreateProjectModel onClose={handleProjectCreation} />}
    </>
  );
};

export default ProjectsPage;
