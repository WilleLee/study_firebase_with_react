import React from "react";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const RouteUserOnly = ({ children }: Props) => {
  const user = auth.currentUser;

  return user === null ? <Navigate to={"/login"} /> : children;
};

export default RouteUserOnly;
