import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/home/";
import FileDropzone from "./components/dropzone";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import SetKeyDialog from "./components/setKey";
import { AnimatePresence } from "framer-motion";
import RoutingAnimation from "./routingAnimation";
import ThemeModeToggler from "./components/toggleTheme";
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [user, setUser] = useState(false);
    const location = useLocation();
    const getUser = async () => {
        const val = await ipcRenderer.invoke("USER_EXISTS");
        setUser(val);
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AnimatePresence exitBeforeEnter>
            <ThemeModeToggler aria-label="toggle" />
            <Routes key={location.pathname} location={location}>
                <Route
                    path="/home"
                    element={
                        <RoutingAnimation>
                            <Home />
                        </RoutingAnimation>
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <RoutingAnimation>
                            <FileDropzone />
                        </RoutingAnimation>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RoutingAnimation>
                            <Signup />
                        </RoutingAnimation>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RoutingAnimation>
                            <Signin />
                        </RoutingAnimation>
                    }
                />
                <Route
                    path="/key"
                    element={
                        <RoutingAnimation>
                            <SetKeyDialog />
                        </RoutingAnimation>
                    }
                />
                <Route
                    path="/"
                    element={
                        <RoutingAnimation>
                            {user ? <Signin /> : <Signup />}
                        </RoutingAnimation>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

export default App;
