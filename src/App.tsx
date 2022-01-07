import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import FileDropzone from './components/dropzone';
import Signup from './auth/signup';
const { ipcRenderer } = window.require('electron');

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
		ipcRenderer.sendSync('fauxcmd');
		getAllItems();
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/upload" element={<FileDropzone />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</Router>
	);
}

export default App;
