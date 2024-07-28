// src/pages/SwarmServicePage.tsx
import React, { useEffect, useState } from "react";
import EditableDockerServiceTable from "../shared/components/EditableDockerServiceTable";
import Sidebar from "../shared/components/Sidebar";
import { DataDockerService } from "../shared/types/SwarmService";
import useAuthRedirect from "../shared/hooks/useAuthRedirect";
import { dockerServicesAPI } from "../api/Docker";

const SwarmServicePage: React.FC = () => {
	const isAuthenticated = useAuthRedirect();
	const [data, setData] = useState<DataDockerService[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			setLoading(true);
			dockerServicesAPI()
				.then((response: DataDockerService[]) => {
					// Convert the labels from object to array of LabelDockerService
					setData(response);
				})
				.catch((err: Error) => {
					if (err.message === "invalid token") {
						localStorage.removeItem("access_token");
						window.location.reload();
					}
					setError(err.message || "Failed to fetch data");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [isAuthenticated]);
	if (!isAuthenticated) {
		return null; // Or return a loading spinner or message if needed
	}

	if (loading) {
		return <div>Loading...</div>; // Or a better loading indicator
	}

	if (error) {
		return <div>Error: {error}</div>; // Or a better error message
	}

	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="flex-1 p-4">
				<h1 className="text-2xl font-bold mb-4">Swarm Services</h1>
				<div className="overflow-x-auto">
					<EditableDockerServiceTable data={data} />
				</div>
			</div>
		</div>
	);
};

export default SwarmServicePage;
