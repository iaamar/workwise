import { Outlet } from "@remix-run/react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import ProjectBoard from "./ProjectBoard";
import { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as projectService from "../services/project-service";
import Project from "../models/project";
import WorkItemCard from "../components/WorkItemCard";
import {
  fetchProjectDetails,
  resetCurrentProject,
} from "../store/slices/project-slice";
import {
  createNewWorkItem,
  selectWorkItems,
  setCurrentWorkItem,
  workitemsFetched,
} from "../store/slices/workitem-slice";
import { ChakraProvider, theme, Text } from "@chakra-ui/react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import { selectCurrentUser } from "../store/slices/user-slice";
import CreateWorkItemModel from "../components/CreateWorkItemModel";
import { FaPlus } from "react-icons/fa";
import { Search } from "../components/Search";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
import { selectProjectById } from "../store/slices/project-slice";
import { resetCommentState } from "../store/slices/comment-slice";
import { resetTaskState } from "../store/slices/task-slice";
const sectionTitles: Record<string, string> = {
  board: "board",
  analytics: "Analytics",
  backlog: "Backlog",
};
const defaultSection = "board";

// BoardView component
const BoardView = () => {
  // Local state and hooks
  const [project, setProject] = useState<Project | any>();
  const dispatch: AppDispatch = useDispatch();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  //const project = useSelector(selectProjectById);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch project details and work items on component mount or when projectId changes
  useEffect(() => {
    dispatch(setCurrentWorkItem(null));
    dispatch(resetCommentState());
    dispatch(resetTaskState());
    setLoading(true);
    if (projectId) {
      projectService.getProjectById(projectId).then((project) => {
        setProject(project);
        dispatch(fetchProjectDetails(project));
        dispatch(workitemsFetched(project.workitems));
        setLoading(false);
      });
    }
  }, [dispatch, projectId]);
  const storeWorkItems = useSelector(selectWorkItems);

  // Get current location and section
  const location = useLocation();
  const section = location.pathname.split("/").slice(-1)[0];
  const sectionTitle = sectionTitles[section] || sectionTitles[defaultSection];

  // Handle search functionality
  const onSearch = (searchText: string) => {
    if (searchText) {
      const filteredWorkItems = (project?.workitems as any).filter(
        (workItem: any) => {
          return workItem.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }
      );

      // Dispatch the filtered work items to the store
      dispatch(workitemsFetched(filteredWorkItems));
    } else {
      // If search text is empty, dispatch the original work items to the store
      dispatch(workitemsFetched(project?.workitems ?? []));
    }
  };

  useEffect(() => {
    console.log("BoardView useEffect");
    const fetchData = async () => {
      await dispatch(fetchProjectDetails(projectId ?? "") as any);
    };
    fetchData();
  }, []);

  const { t } = useTranslation("common");

  // Render the component
  return (
    <>
      <div className=" flex h-screen flex-grow">
        {/* <ProjectBoard project={project} /> */}
        <div className="z-10 flex h-full w-full flex-grow flex-col py-6 px-5">
          <section>
            {/* Navigation links */}
            <NavLink
              onClick={() => dispatch(resetCurrentProject())}
              to="/projects"
              className="underline underline-offset-[3px]"
            >
              {t("board.navlink.projects.label")}
            </NavLink>
            <span className="mx-2">/</span>
            <span>{project?.name}</span>
          </section>
          <Outlet />

          {/* Action buttons */}
          <div className="flex space-evenly w-[500] gap-5 mt-5 mb-10">
            <button
              className="justify-evenly flex cursor-pointer items-center bg-primary-light text-xs dark:focus-visible:outline-white border-1 box-border h-[40px] w-[120px] rounded border-none bg-grey-100 outline outline-2 outline-grey-400 hover:bg-grey-300 "
              onClick={() => setIsOpen(true)}
            >
              <FaPlus /> {t("board.button.addworkitem.label")}
            </button>
            <Search
              handleSearch={onSearch}
              placeholder={t("board.search.filter.placeholder")}
            />
          </div>
          <Outlet />

          {/* Kanban Board component */}
          <ChakraProvider theme={theme}>
            <KanbanBoard
              onClose={() => setIsOpen(false)}
              workitems={storeWorkItems ?? []}
              teamMembers={project?.teamMembers}
              projectId={projectId ? projectId : ""}
              ownerId={currentUser?._id ?? ""}
            />
          </ChakraProvider>
        </div>
      </div>

      {/* CreateWorkItemModel component */}
      {isOpen && (
        <CreateWorkItemModel
          onClose={() => setIsOpen(false)}
          teamMembers={project?.teamMembers ?? []}
          projectId={projectId ? projectId : ""}
          ownerId={currentUser?._id ?? ""}
        />
      )}
    </>
  );
};

export default BoardView;
