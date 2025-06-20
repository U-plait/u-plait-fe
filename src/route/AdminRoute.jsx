import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserStore from "../context/userStore";

const AdminRoute = () => {
  const { user } = useUserStore();
  const location = useLocation();

  const role = user?.role
  console.log(role)

  if (!role) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "ADMIN") {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/mobile" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;