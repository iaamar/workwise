// Layout.tsx
import React, { ReactNode, Suspense } from "react";
import MainHeader from "./Header/MainHeader";
import { Route } from "react-router-dom";
import BoardLayout from "../pages/ProjectBoard/BoardLayout";

// Props interface definition for the Layout component
interface LayoutProps {
  children: ReactNode;
}

// Layout component definition
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{children}</div>
    </Suspense>
  );
};

export default Layout;
