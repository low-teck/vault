import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";
import theme from "./theme";
import "@fontsource/nunito";
import "@fontsource/gochi-hand";
// import "./styles.css";

ReactDOM.render(
    <Router>
        <ChakraProvider theme={theme}>
            <ColorModeScript />
            <App />
        </ChakraProvider>
    </Router>,
    document.getElementById("root")
);
