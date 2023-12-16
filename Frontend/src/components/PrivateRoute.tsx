import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/user-slice";
import { Outlet, Navigate } from "react-router-dom";
import Layout from "./Layout";

const PrivateRoute = () => {
  const currentUser = useSelector(selectCurrentUser);
  return currentUser ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
