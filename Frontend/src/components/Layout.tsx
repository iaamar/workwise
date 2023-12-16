// Layout.tsx
import React, { ReactNode, Suspense } from "react";
import MainHeader from "./MainHeader";

// Props interface definition for the Layout component
interface LayoutProps {
  children: ReactNode;
}

// Layout component definition
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex  flex-col">
      <Suspense fallback={<div></div>}>
        <div className="fixed top-0 w-full z-10">
          <MainHeader />
        </div>

        <div className="flex flex-row flex-1">
          <div
            className="content h-screen flex-1 overflow-y-auto mt-16"
            style={{ overflowY: "auto" }}
          >
            {children}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
