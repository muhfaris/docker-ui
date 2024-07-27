// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./../../pages/LoginPage";
import DashboardPage from "./../../pages/Dashboard";
import { useNavigate } from "react-router-dom";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
	element,
}) => {
	const isAuthenticated = !!localStorage.getItem("access_token");
	const navigate = useNavigate();

	if (!isAuthenticated) {
		navigate("/login");
		return null;
	}

	return element;
};

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/dashboard"
					element={<PrivateRoute element={<DashboardPage />} />}
				/>
				{/* Add more routes here */}
			</Routes>
		</Router>
	);
};

export default App;
