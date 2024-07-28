import React, { useState, useRef, useEffect } from "react";
import {
	dockerServicesAPI,
	updateDockerServiceAPI,
	updateStatusDockerServiceAPI,
} from "../../api/Docker";
import {
	DataDockerService,
	UpdateStatusDockerServiceRequest,
} from "../types/SwarmService";
import Switcher from "./Switch";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Assuming you are using Heroicons for the clear icon

// Function to format date
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		month: "numeric",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(date);
};

interface EditableTableProps {
	data: DataDockerService[];
}

const EditableDockerServiceTable: React.FC<EditableTableProps> = ({ data }) => {
	const [tableData, setTableData] = useState<DataDockerService[]>(data);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [originalData, _] = useState<DataDockerService[]>(data);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const [filter, setFilter] = useState("");

	const fetchFilterData = async (filterValues: string[]) => {
		try {
			const response = await dockerServicesAPI({
				keywords: filterValues,
			});
			setTableData(response);
		} catch (error: any) {
			// if error invalid token
			if (error.message === "invalid token") {
				localStorage.removeItem("access_token");
				window.location.reload();
			}
			console.error(error);
		}
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(e.target.value);
		if (e.target.value === "") {
			return;
		}

		const filterValues = filter
			.toLowerCase()
			.split(",")
			.map((value) => value.trim());

		if (filterValues.length === 0) {
			fetchFilterData(filterValues);
		}
	};

	const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const value = e.currentTarget.value;

			if (value === "") {
				fetchFilterData([]);
				return;
			}

			const filterValues = value
				.toLowerCase()
				.split(",")
				.map((val) => val.trim());

			if (filterValues.length > 0) {
				fetchFilterData(filterValues);
			}
		}
	};

	const handleClearFilter = () => {
		setFilter("");
		fetchFilterData([]);
		// Optionally, you can clear the table data or reset it here
		// setTableData([]);
	};

	const handleChange = (index: number, field: string, value: any) => {
		const newData = [...tableData];
		newData[index] = { ...newData[index], [field]: value };
		setTableData(newData);
	};

	const handleLabelKeyChange = (index: number, id: string, newKey: string) => {
		const newData = [...tableData];
		const label = newData[index].labels.find((label) => label.id === id);
		if (label) {
			label.key = newKey;
			setTableData(newData);
		}
	};

	const handleLabelValueChange = (
		index: number,
		id: string,
		newValue: string,
	) => {
		const newData = [...tableData];
		const label = newData[index].labels.find((label) => label.id === id);
		if (label) {
			label.value = newValue;
			setTableData(newData);
		}
	};

	const handleAddLabel = (index: number) => {
		const newData = [...tableData];
		const newId = `new_label_${Date.now()}`;
		newData[index].labels.push({ id: newId, key: "", value: "" });
		setTableData(newData);
	};

	const handleDeleteLabel = (index: number, id: string) => {
		const newData = [...tableData];
		newData[index].labels = newData[index].labels.filter(
			(label) => label.id !== id,
		);
		setTableData(newData);
	};

	const validateRow = (row: DataDockerService) => {
		const errors: string[] = [];
		for (const [key, value] of Object.entries(row.labels)) {
			if (!value.value.trim() && key.trim()) {
				errors.push(`Label key "${key}" cannot have an empty value.`);
			}
		}
		return errors;
	};

	const handleSubmitRow = async (index: number) => {
		const errors = validateRow(tableData[index]);
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}
		console.log("Submitting row:", tableData[index]);
		setValidationErrors([]);
		try {
			const payload: DataDockerService[] = [tableData[index]];
			const response = await updateDockerServiceAPI(payload);
			console.log(response);
		} catch (error) {
			const errors: string[] = [];
			errors.push(`An error occurred while updating the service: ${error}`);
			setValidationErrors(errors);
		}
	};

	const handleSubmitAll = async () => {
		const errors = tableData.flatMap(validateRow);
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}
		console.log("Submitting all data:", tableData);
		setValidationErrors([]);
		try {
			const payload: DataDockerService[] = tableData;
			const response = await updateDockerServiceAPI(payload);
			console.log(response);
		} catch (error) {
			const errors: string[] = [];
			errors.push(`An error occurred while updating the service: ${error}`);
			setValidationErrors(errors);
		}
	};

	const toggleServiceStatus = async (index: number) => {
		const service = tableData[index];
		const newStatus = service.status === "running" ? "inactive" : "active";

		try {
			const payload: UpdateStatusDockerServiceRequest = {
				id: service.id,
				name: service.name,
				status: newStatus,
			};
			const response = await updateStatusDockerServiceAPI(payload);
			if (response) {
			} else {
				console.error("Failed to update the service status");
			}
		} catch (error) {
			console.error("Error updating the service status:", error);
		}
	};

	const handleCancel = () => {
		setTableData(originalData);
		setEditIndex(null);
		setValidationErrors([]);
	};

	useEffect(() => {
		if (editIndex !== null) {
			const keys = Object.keys(inputRefs.current);
			if (keys.length > 0) {
				const firstKey = keys[0];
				inputRefs.current[firstKey]?.focus();
			}
		}
	}, [editIndex]);

	return (
		<div>
			<div className="w-full">
				<input
					type="text"
					value={filter}
					onChange={handleFilterChange}
					onKeyDown={handleFilterKeyDown}
					placeholder="Filter..."
					className="mb-4 border border-gray-300 rounded p-2 w-full pr-10"
				/>
				{filter && (
					<button
						className="absolute mt-2 mb-2 transform text-gray-500 hover:text-gray-700"
						onClick={handleClearFilter}
					>
						<XMarkIcon className="h-5 w-5" />
					</button>
				)}
			</div>
			{validationErrors.length > 0 && (
				<div className="bg-red-200 text-red-700 p-4 mb-4 rounded">
					<ul>
						{validationErrors.map((error, i) => (
							<li key={i}>{error}</li>
						))}
					</ul>
				</div>
			)}
			<table className="min-w-full divide-y divide-gray-200">
				<thead>
					<tr>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
							Name
						</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Labels
						</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
							Replicas
						</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th className="px-6 py-3 bg-gray-50"></th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{tableData.map((row, index) => (
						<tr key={row.id}>
							<td className="px-6 py-4 whitespace-nowrap">
								<div>{row.id}</div>
								<div className="text-xs mt-6 text-gray-500">
									created at {formatDate(row.created_at)}
								</div>
								<div className="text-xs text-gray-500">
									updated at {formatDate(row.updated_at)}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap w-96">
								{editIndex === index ? (
									<input
										type="text"
										value={row.name}
										onChange={(e) =>
											handleChange(index, "name", e.target.value)
										}
										className="border border-gray-300 rounded p-2"
										disabled={true}
										ref={(el) => el && (inputRefs.current["name"] = el)}
									/>
								) : (
									<>
										<div className="">{row.name}</div>
										{/* <div className="text-xs text-gray-500">{row.image}</div> */}
									</>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{tableData[index].labels.map(({ id, key, value }) => (
									<div key={id} className="flex items-center mb-2">
										{editIndex !== index && (
											<>
												{key}: {value}
											</>
										)}

										{editIndex === index && (
											<>
												<input
													type="text"
													value={key}
													onChange={(e) =>
														handleLabelKeyChange(index, id, e.target.value)
													}
													disabled={editIndex !== index}
													className={`border border-gray-300 rounded p-2 mr-2 ${editIndex === index ? "" : "bg-gray-100"}`}
												/>
												<input
													type="text"
													value={value}
													onChange={(e) =>
														handleLabelValueChange(index, id, e.target.value)
													}
													disabled={editIndex !== index}
													className={`border border-gray-300 rounded p-2 mr-2 ${editIndex === index ? "" : "bg-gray-100"}`}
												/>
												{editIndex === index && (
													<button
														onClick={() => handleDeleteLabel(index, id)}
														className="text-red-500"
													>
														Delete
													</button>
												)}
											</>
										)}
									</div>
								))}{" "}
								{editIndex === index && (
									<button
										onClick={() => handleAddLabel(index)}
										className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
									>
										Add Label
									</button>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{editIndex === index ? (
									<input
										type="number"
										value={row.replicas}
										onChange={(e) => {
											const value = parseInt(e.target.value);
											handleChange(index, "replicas", value);
										}}
										className="border border-gray-300 rounded p-2 w-24"
										ref={(el) => el && (inputRefs.current["replicas"] = el)}
									/>
								) : (
									<div>{row.replicas}</div>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<Switcher
									isChecked={row.status === "running"}
									handleToggle={() => toggleServiceStatus(index)}
								/>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{editIndex === index ? (
									<>
										<button
											onClick={() => {
												handleSubmitRow(index);
												setEditIndex(null);
											}}
											className="bg-blue-500 text-white px-4 py-2 rounded"
										>
											Save
										</button>
										<button
											onClick={handleCancel}
											className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
										>
											Cancel
										</button>
									</>
								) : (
									<button
										onClick={() => setEditIndex(index)}
										className="bg-gray-500 text-white px-4 py-2 rounded"
									>
										Edit
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-4">
				<button
					onClick={handleSubmitAll}
					className="bg-green-500 text-white px-4 py-2 rounded"
				>
					Save All
				</button>
				<button
					onClick={handleCancel}
					className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default EditableDockerServiceTable;
