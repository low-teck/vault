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
    IconButton,
    useToast,
} from "@chakra-ui/react";
import Menu from "./menu";
import { List, ListItem, ListIcon, Divider } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
const { ipcRenderer } = window.require("electron");

const Home = () => {
    const [filenames, setFilenames] = useState<String[]>([]);
    const toast = useToast();

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFilenames(data);
    };

    useEffect(() => {
        getData();
    });

    // const findAndDecrypt = (filename: any) => {
    //     let file = null;
    //     list.map((item: any) => {
    //         if (item.file.filename === filename) {
    //             file = item;
    //         }
    //     });
    //     // decrypt and download file
    // };

    return (
        <Box w="100vw" h="100vh">
            <Stack spacing={4} direction="row">
                <Menu />
            </Stack>
            <Container>
                <Heading>my files</Heading>
                <br />
                {filenames && (
                    <List spacing={5}>
                        {filenames.map((filename: any) => (
                            <>
                                <ListItem key={filename}>
                                    <HStack spacing={5} justify="space-between">
                                        <HStack>
                                            <ListIcon
                                                as={ArrowRightIcon}
                                                color="green.500"
                                            />
                                            <Text>{filename}</Text>
                                        </HStack>
                                        <IconButton
                                            aria-label={`download ${filename}`}
                                            variant="ghost"
                                            icon={<DownloadIcon w={6} h={6} />}
                                            onClick={async () => {
                                                let code =
                                                    await ipcRenderer.invoke(
                                                        "DOWNLOAD_FILE",
                                                        { filename }
                                                    );
                                                if (code == "SUCCESS") {
                                                    toast({
                                                        title: `saved ${filename}!`,
                                                        variant: "left-accent",
                                                        status: "success",
                                                        isClosable: true,
                                                    });
                                                } else {
                                                    toast({
                                                        title: "some error occured, try again",
                                                        variant: "left-accent",
                                                        status: "error",
                                                        isClosable: true,
                                                    });
                                                }
                                            }}
                                        />
                                    </HStack>
                                </ListItem>
                                <Divider />
                            </>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default Home;
