import React, { useEffect, useState } from "react";
import {
    Box,
    HStack,
    Heading,
    Center,
    Button,
    AbsoluteCenter,
    useColorModeValue,
    Text,
    Icon,
    Tooltip,
    Flex,
} from "@chakra-ui/react";
import Menu from "../menu";
import { List } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce/lib";
import * as _ from "lodash";
import SearchFiles from "./searchFiles";
import { AnimatePresence } from "framer-motion";
import Loading from "../loading";
import { FileInfo } from "../../types";
import FileListItem from "./fileListItem";
import { InfoIcon } from "@chakra-ui/icons";
const { ipcRenderer } = window.require("electron");

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const barBg = useColorModeValue("white", "gray.800");
    const iconScheme = useColorModeValue("teal.500", "teal.200");
    const [toggle, setToggle] = useState<boolean>();
    const [query, setQuery] = useState<string>("");
    const [debouncedQuery] = useDebounce(query, 500);
    const [sort, setSort] = useState<boolean>(false);

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFileData(data);
        setLoading(false);
    };

    const handleSort = (
        a: Fuse.FuseResult<FileInfo>,
        b: Fuse.FuseResult<FileInfo>
    ): number => {
        return sort
            ? a.item.filename.localeCompare(b.item.filename)
            : b.item.date.getTime() - a.item.date.getTime();
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

    useEffect(() => {
        setLoading(true);
        getData();
    }, []);

    const refresh = () => {
        setToggle(!toggle);
    };

    const handleQueryChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <Box
            w="100vw"
            h="100vh"
            overflowY="scroll"
            bg={barBg}
            overflowX="hidden"
        >
            <Box position="fixed" zIndex="sticky" margin="4rem">
                <Menu />
            </Box>
            <Center>
                <Box w="50vw">
                    <Box
                        overflow="hidden"
                        bg={barBg}
                        zIndex="sticky"
                        position="fixed"
                    >
                        <Box w="50vw" paddingTop="4rem" zIndex="sticky">
                            <HStack marginRight="1">
                                <SearchFiles
                                    value={query.toString()}
                                    handleQueryChanges={handleQueryChanges}
                                />
                                <Tooltip label="sort by">
                                    <Button
                                        minW="4rem"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSort(!sort);
                                        }}
                                        colorScheme="teal"
                                        margin="1rem"
                                    >
                                        {sort ? "a-z" : "date"}
                                    </Button>
                                </Tooltip>
                            </HStack>
                            <br />
                            <Heading>my files</Heading>
                        </Box>
                    </Box>
                    <br />

                    {!loading ? (
                        queryResults.length ? (
                            <List
                                spacing={5}
                                w="50vw"
                                position="relative"
                                marginTop="20vh"
                            >
                                <AnimatePresence>
                                    {[...queryResults]
                                        .sort(handleSort)
                                        .map((res, index: number) => (
                                            <FileListItem
                                                key={index}
                                                res={res}
                                                refresh={refresh}
                                            />
                                        ))}
                                </AnimatePresence>
                            </List>
                        ) : (
                            <AbsoluteCenter>
                                <Flex
                                    alignItems="center"
                                    flexDirection="column"
                                >
                                    <Tooltip
                                        label="try going to the menu and adding a file"
                                        placement="right"
                                    >
                                        <Icon
                                            as={InfoIcon}
                                            fontSize="3xl"
                                            color={iconScheme}
                                        />
                                    </Tooltip>
                                    <Text marginTop="1rem" fontSize="xl">
                                        no files found!
                                    </Text>
                                </Flex>
                            </AbsoluteCenter>
                        )
                    ) : (
                        <AbsoluteCenter>
                            <Loading />
                        </AbsoluteCenter>
                    )}
                </Box>
            </Center>
        </Box>
    );
};

export default Home;
