import React from "react";
import { Box, Button, Container, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <Box>
            <Stack spacing={4} direction="row" align="right">
                <Box>
                    <Link to="/upload">
                        <Button
                            size="md"
                            height="48px"
                            width="200px"
                            border="2px"
                        >
                            Upload Document
                        </Button>
                    </Link>
                </Box>
            </Stack>
            <Container>
                <h1>MY FILES</h1>
            </Container>
        </Box>
    );
};

export default Home;
