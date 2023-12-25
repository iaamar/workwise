import { Outlet } from "@remix-run/react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as projectService from "../../services/project-service";
import Project from "../../models/project";
import {
  fetchProjectDetails,
  resetCurrentProject,
} from "../../store/slices/project-slice";
import {
  selectWorkItems,
  setCurrentWorkItem,
  workitemsFetched,
} from "../../store/slices/workitem-slice";
import { ChakraProvider, theme } from "@chakra-ui/react";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { selectCurrentUser } from "../../store/slices/user-slice";
import CreateWorkItemModel from "../../components/CreateWorkItemModel";
import { FaPlus } from "react-icons/fa";
import { Search } from "../../components/Search";
import { useTranslation } from "react-i18next";
import { resetCommentState } from "../../store/slices/comment-slice";
import { resetTaskState } from "../../store/slices/task-slice";
import User from "../../models/user";
import { UserAvatar } from "../../components/Header/UserAvatar";
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
    setLoading(false);
    if (projectId) {
      projectService.getProjectById(projectId).then((project) => {
        setProject(project);
        dispatch(fetchProjectDetails(project));
        dispatch(workitemsFetched(project.workitems));
        setLoading(false);
      });
    }
  }, [dispatch, projectId, project]);
  const storeWorkItems = useSelector(selectWorkItems);

  // Get current location and section
  const location = useLocation();
  const section = location.pathname.split("/").slice(-1)[0];
  const sectionTitle = sectionTitles[section] || sectionTitles[defaultSection];

  // Handle search functionality
  const onSearch = (searchText: string) => {
    console.log(project);
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
    const fetchData = async () => {
      await dispatch(fetchProjectDetails(projectId ?? "") as any);
    };
    fetchData();
  }, [dispatch, projectId]);

  const { t } = useTranslation("common");

  const handleClick = () => {
    setIsOpen(true);
  };
  // Render the component
  return (
    <>
      <div className=" flex h-screen flex-grow mt-16">
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
            <span className="font-semibold font-lg">{project?.name}</span>
          </section>
          <Outlet />

          {/* Action buttons */}
          <div className="flex space-evenly w-[500] gap-5 mt-5 mb-10 items-center">
            <button
              className="justify-evenly flex cursor-pointer items-center text-xs dark:focus-visible:outline-white border-1 box-border h-[40px] w-[120px] rounded border-none bg-grey-100 outline outline-2 outline-grey-400 hover:bg-grey-300 "
              onClick={() => handleClick()}
            >
              <FaPlus /> {t("board.button.addworkitem.label")}
            </button>
            <Search
              handleSearch={onSearch}
              placeholder={t("board.search.filter.placeholder")}
            />
            <div className="flex">
              {project?.teamMembers?.map((member: User) => {
                return (
                  <div className="my-0 inline">
                    <span className="flex">
                      <div className="z-10 -ml-[5px] rounded-full border-2 hover:z-20 hover:border-primary-700 hover:cursor-pointer hover:scale-105  hover:shadow-lg opacity-80 hover:opacity-100 transition-all duration-350">
                        <div className="relative w-fit">
                          <UserAvatar
                            name={member?.firstName + " " + member?.lastName}
                            key={member._id}
                            image={member?.photoURL}
                            color="#e97f33"
                            size={35}
                            tooltip={true}
                          />
                        </div>
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
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
