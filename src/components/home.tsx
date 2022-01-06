import React from "react";
import { Box, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<Box>
			<Link to="/upload">
				<Button
					size="md"
					height="48px"
					width="200px"
					border="2px"
					borderColor="green.500"
				>
					Upload Document
				</Button>
			</Link>
			<Link to="/signup">
				<Button>Signup</Button>
			</Link>
			<Container>
				<h1>MY FILES</h1>
			</Container>
		</Box>
	);
}

export default Home;
