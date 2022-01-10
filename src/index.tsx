import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";
import "./fonts/Patrick_Hand/PatrickHand-Regular.ttf";

const colors = {
	brand: {
		900: "#1a365d",
		800: "#153e75",
		700: "#2a69ac",
	},
	fonts: {
		body: "Patrick Hand",
	},
};

const theme = extendTheme({ colors });

ReactDOM.render(
	<Router>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</Router>,
	document.getElementById("root")
);
