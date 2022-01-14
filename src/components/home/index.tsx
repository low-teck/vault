import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    HStack,
    Heading,
    IconButton,
    useToast,
    Center,
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
import { SortCriteria } from "../../types";
const { ipcRenderer } = window.require("electron");

interface FileInfo {
    filename: string;
    saved: Boolean;
    date: Date;
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
    const [sort, setSort] = useState<boolean>(false);

    const toast = useToast();

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFileData(data);
    };

    const handleSort = (sortCriteria: SortCriteria) => {
        let data = fileData;
        data.sort((a, b) =>
            sortCriteria === "filename"
                ? +b[sortCriteria].toLowerCase() <
                  +a[sortCriteria].toLowerCase()
                    ? 1
                    : b[sortCriteria].toLowerCase() >
                      a[sortCriteria].toLowerCase()
                    ? -1
                    : 0
                : +b[sortCriteria] - +a[sortCriteria]
        );
        setFileData(data);
        setSort(!sort);
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
    }, [debouncedQuery, fileData, sort]);

    useEffect(() => {
        getData();
    }, [toggle]);

    const handleQueryChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <Box w="100vw" h="100vh" overflowY="scroll" overflowX="hidden">
            <Box position="fixed" zIndex="sticky" margin="4rem">
                <Menu handleSort={handleSort} />
            </Box>
            <Center bg="white">
                <Box w="50vw">
                    <Box
                        bg="white"
                        overflow="hidden"
                        zIndex="sticky"
                        position="fixed"
                    >
                        <Box w="50vw" paddingTop="4rem" zIndex="sticky">
                            <SearchFiles
                                value={query.toString()}
                                handleQueryChanges={handleQueryChanges}
                            />
                            <br />
                            <Heading>my files</Heading>
                        </Box>
                    </Box>
                    <br />
                    {fileData && (
                        <List spacing={5} w="50vw" marginTop="20vh">
                            {queryResults.map((res) => (
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
                                                <Text>{res.item.filename}</Text>
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
                                                            res.item.filename;
                                                        let data =
                                                            await ipcRenderer.invoke(
                                                                "DEC_FILE",
                                                                {
                                                                    name,
                                                                }
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
                                                            {
                                                                name,
                                                            }
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
                                                                {
                                                                    name,
                                                                }
                                                            );
                                                            setToggle(!toggle);
                                                        }}
                                                    />
                                                )}
                                            </HStack>
                                        </HStack>
                                    </ListItem>
                                    <Divider />
                                </>
                            ))}
                        </List>
                    )}
                </Box>
            </Center>
        </Box>
    );
};

export default Home;
