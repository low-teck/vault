import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Container,
    Stack,
    Text,
    HStack,
    Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Menu from "./menu";
import { List, ListItem, ListIcon, Divider } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
const { ipcRenderer } = window.require("electron");

const Home = () => {
    const [list, setList] = useState<any[]>([]);

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        const items: any[] = [];
        if (data) {
            data.map((item: any) => {
                items.push(item);
            });
            setList(items);
        }
        console.log("list :", list);
    };

    useEffect(() => {
        getData();
    });

    const findAndDecrypt = (filename: any) => {
        let file = null;
        list.map((item: any) => {
            if (item.file.filename === filename) {
                file = item;
            }
        });
        // decrypt and download file
    };

    return (
        <Box w="100vw" h="100vh">
            <Stack spacing={4} direction="row">
                <Menu />
            </Stack>
            <Container>
                <Heading>my files</Heading>
                <br />
                <List spacing={5}>
                    {list.map((item: any) => (
                        <>
                            <ListItem key={item.file.filename}>
                                <HStack spacing={5} justify="space-between">
                                    <HStack>
                                        <ListIcon
                                            as={ArrowRightIcon}
                                            color="green.500"
                                        />
                                        <Text>{item.file.filename}</Text>
                                    </HStack>
                                    <span>
                                        <DownloadIcon w={6} h={6} />
                                    </span>
                                </HStack>
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </Container>
        </Box>
    );
};

export default Home;
