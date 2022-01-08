import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import FileDropzone from "./components/dropzone";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import PrivateRoute from "./components/privateRoute";
const { ipcRenderer } = window.require("electron");

function App() {
	const [items, setItems] = useState([]);

	const getAllItems = () => {
		// db.find({}, (err: any, docs: any) => {
		// 	if (!err) {
		// 		setItems(docs);
		// 	}
		// });
	};

	useEffect(() => {
		ipcRenderer.invoke("fauxcmd");
		getAllItems();
	}, []);

	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<PrivateRoute />}>
					<Route path="/" element={<Home />} />
				</Route>
				<Route path="/upload" element={<FileDropzone />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Signin />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
