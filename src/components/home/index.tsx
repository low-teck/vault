import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Text,
    HStack,
    Heading,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import Menu from "../menu";
import { List, ListItem, ListIcon, Divider } from "@chakra-ui/react";
import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce/lib";
import * as _ from "lodash";
import SearchFiles from "./searchFiles";
import { decrypt } from "./decrypt";
const { ipcRenderer } = window.require("electron");

interface FileInfo {
    filename: string;
    saved: Boolean;
}

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const [toggle, setToggle] = useState<boolean>();
    const [query, setQuery] = useState<string>("");
    const [debouncedQuery] = useDebounce(query, 500);

    const toast = useToast();

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFileData(data);
    };

    useEffect(() => {
        let fuse = new Fuse(fileData, fuseOptions);
        let res = debouncedQuery
            ? fuse.search(debouncedQuery)
            : _.map<FileInfo, Fuse.FuseResult<FileInfo>>(
                  fileData,
                  (item, index) => ({
                      item,
                      refIndex: index,
                      matches: [],
                      score: 1,
                  })
              );
        setQueryResults(res);
    }, [debouncedQuery, fileData]);

    useEffect(() => {
        getData();
    }, [toggle]);

    const handleQueryChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <Box w="100vw" h="100vh">
            <Box>
                <Menu />
            </Box>
            <Container>
                <SearchFiles
                    value={query.toString()}
                    handleQueryChanges={handleQueryChanges}
                />
                <br />
                <br />
                <Heading>my files</Heading>
                <br />
                {fileData && (
                    <List spacing={5}>
                        {queryResults.map((res) => (
                            <>
                                {true && (
                                    <>
                                        <ListItem key={res.item.filename}>
                                            <HStack
                                                spacing={5}
                                                justify="space-between"
                                            >
                                                <HStack>
                                                    <ListIcon
                                                        as={ArrowRightIcon}
                                                        color="green.500"
                                                    />
                                                    <Text>
                                                        {res.item.filename}
                                                    </Text>
                                                </HStack>
                                                <HStack>
                                                    <IconButton
                                                        aria-label={`download ${res.item.filename}`}
                                                        variant="ghost"
                                                        icon={
                                                            <DownloadIcon
                                                                w={4}
                                                                h={4}
                                                            />
                                                        }
                                                        onClick={async () => {
                                                            let name =
                                                                res.item
                                                                    .filename;
                                                            let data =
                                                                await ipcRenderer.invoke(
                                                                    "DEC_FILE",
                                                                    { name }
                                                                );
                                                            if (data) {
                                                                toast({
                                                                    title: `downloaded ${name}`,
                                                                    variant:
                                                                        "left-accent",
                                                                    status: "success",
                                                                    isClosable:
                                                                        true,
                                                                });
                                                            } else {
                                                                toast({
                                                                    title: `some error occured, try again :(`,
                                                                    variant:
                                                                        "left-accent",
                                                                    status: "error",
                                                                    isClosable:
                                                                        true,
                                                                });
                                                            }
                                                            await decrypt(data);
                                                            await ipcRenderer.invoke(
                                                                "SAVE_STATE",
                                                                { name }
                                                            );
                                                            setToggle(!toggle);
                                                        }}
                                                    />
                                                    {res.item.saved && (
                                                        <IconButton
                                                            aria-label={`delete ${res.item.filename}`}
                                                            variant="ghost"
                                                            icon={
                                                                <DeleteIcon
                                                                    w={4}
                                                                    h={4}
                                                                />
                                                            }
                                                            onClick={async () => {
                                                                let name =
                                                                    res.item
                                                                        .filename;
                                                                await ipcRenderer.invoke(
                                                                    "DELETE_FILE",
                                                                    { name }
                                                                );
                                                                setToggle(
                                                                    !toggle
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </HStack>
                                            </HStack>
                                        </ListItem>
                                        <Divider />
                                    </>
                                )}
                            </>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default Home;
