import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProjectBoard from "../pages/ProjectBoard";
import { useSelector } from "react-redux";
import { selectProjectById } from "../store/slices/project-slice";

interface ProjectLayoutProps {
  children?: React.ReactNode;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <ProjectBoard />
      <div className="flex-grow p-3 overflow-y-auto mx-auto">{children}</div>
    </div>
  );
};

export default ProjectLayout;
