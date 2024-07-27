// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SwarmServicePage from "./pages/SwarmServicePage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
	return (
		<Router>
			<div className="flex">
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/swarms/services" element={<SwarmServicePage />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
