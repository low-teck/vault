import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/";
import FileDropzone from "./components/dropzone";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import SetKeyDialog from "./components/setKey";
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [user, setUser] = useState(false);

    const getUser = async () => {
        const val = await ipcRenderer.invoke("USER_EXISTS");
        console.log("after :", val);
        setUser(val);
    };

    useEffect(() => {
        getUser();
    });

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<FileDropzone />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/key" element={<SetKeyDialog />} />
            <Route path="/" element={user ? <Signin /> : <Signup />} />
        </Routes>
    );
};

export default App;
