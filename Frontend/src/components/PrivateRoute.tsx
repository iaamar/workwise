import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/user-slice";
import { Outlet, Navigate } from "react-router-dom";
import Layout from "./Layout";
import MainHeader from "./Header/MainHeader";
import BoardLayout from "../pages/ProjectBoard/BoardLayout";
import SideBar from "../pages/ProjectBoard/SideBar";

const PrivateRoute = () => {
  const currentUser = useSelector(selectCurrentUser);
  return currentUser ? (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
