import React from "react";
import { Navigate, Route, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const currentUser = true;
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
