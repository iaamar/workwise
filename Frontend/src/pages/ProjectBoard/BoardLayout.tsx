import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import MainHeader from "../../components/Header/MainHeader";

interface ProjectLayoutProps {
  children?: React.ReactNode;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white dark:bg-dark-400 dark:text-font-main-dark">
      <MainHeader />
      <SideBar />
      <Outlet />
      <div className="flex-grow p-3 overflow-y-auto mx-auto">{children}</div>
    </div>
  );
};

export default ProjectLayout;
