import React from "react";
import { Box, Button, Center, Container, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Menu from "./menu";

const Home = () => {
    return (
        <Box w="100vw" h="100vh">
            <Center w="100vw">
                <Stack spacing={4} direction="row" align="right">
                    <Menu />
                </Stack>
                <Container>
                    <h1>MY FILES</h1>
                </Container>
            </Center>
        </Box>
    );
};

export default Home;
