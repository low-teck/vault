import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";
import theme from "./theme";

ReactDOM.render(
	<Router>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</Router>,
	document.getElementById("root")
);
