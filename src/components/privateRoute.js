import React from 'react';
import { Navigate, Route, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
	const currentUser = false;
	return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
