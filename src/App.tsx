import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import FileDropzone from "./components/dropzone";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [user, setUser] = useState(false);

    const getUser = async () => {
        const val = await ipcRenderer.invoke("USER_EXISTS");
        console.log("after :", val);
        setUser(val);
    };

    useEffect(() => {
        console.log("before :", user);
        getUser();
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<FileDropzone />} />
            <Route path="/auth" element={!user ? <Signin /> : <Signup />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/" element={user === true ? <Signin /> : <Signup />} />
        </Routes>
    );
};

export default App;
