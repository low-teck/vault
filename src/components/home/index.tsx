import React, { useEffect, useRef, useState } from "react";
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
    Progress,
    IconButton,
    IconButtonProps,
} from "@chakra-ui/react";
import { Virtuoso } from "react-virtuoso";
import Menu from "../menu";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce/lib";
import * as _ from "lodash";
import SearchFiles from "./searchFiles";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../loading";
import { FileInfo } from "../../types";
import FileListItem from "./fileListItem";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "@chakra-ui/icons";
const { ipcRenderer } = window.require("electron");

const MotionIconButton = motion<IconButtonProps>(IconButton);

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

const Footer = () => {
    return (
        <Flex w="50vw" h="10vh">
            <Center w="50vw" h="10vh" textAlign="center">
                if you've reached and here and didn't find your file, it's
                probably not in vault ; )
            </Center>
        </Flex>
    );
};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const virtuoso = useRef(null);
    const [upVisible, setUpVisible] = useState<boolean>(false);
    const [downVisible, setDownVisible] = useState<boolean>(true);
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

    const toggleUpVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 0) {
            setUpVisible(true);
        } else if (scrolled <= 0) {
            setUpVisible(false);
        }
    };
    const toggleDownVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled + 1500 >= document.documentElement.scrollHeight) {
            setDownVisible(false);
        } else {
            setDownVisible(true);
        }
    };

    window.addEventListener("scroll", toggleDownVisible);
    window.addEventListener("scroll", toggleUpVisible);

    return (
        <Box
            w="100vw"
            h="100vh"
            bg={barBg}
            overflowX="hidden"
            overflowY="scroll"
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
                                    filesNumber={fileData.length}
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
                            <Progress
                                sx={{
                                    "& > div:first-child": {
                                        transitionProperty: "width",
                                    },
                                }}
                                size="xs"
                                borderRadius="10px"
                                colorScheme={"teal"}
                                max={fileData.length}
                                value={queryResults.length}
                            />
                            <br />
                            <Heading>my files</Heading>
                        </Box>
                    </Box>
                    <br />

                    {!loading ? (
                        queryResults.length ? (
                            <>
                                <div>
                                    <Virtuoso
                                        style={{
                                            overflow: "hidden",
                                            width: "50vw",
                                            marginBottom: "2vh",
                                            flexDirection: "column",
                                            position: "absolute",
                                            marginTop: "24vh",
                                        }}
                                        components={{ Footer }}
                                        ref={virtuoso}
                                        useWindowScroll={true}
                                        data={queryResults.sort(handleSort)}
                                        itemContent={(
                                            index: number,
                                            val: Fuse.FuseResult<FileInfo>
                                        ) => {
                                            return (
                                                <div>
                                                    <FileListItem
                                                        key={index}
                                                        res={val}
                                                        refresh={refresh}
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                                <AnimatePresence>
                                    {downVisible && (
                                        <Box
                                            position="fixed"
                                            right="17vw"
                                            top="30vh"
                                        >
                                            <MotionIconButton
                                                colorScheme="teal"
                                                animate={{ scale: 1 }}
                                                initial={{ scale: 0 }}
                                                exit={{ scale: 0 }}
                                                borderRadius="3xl"
                                                onClick={() => {
                                                    window.scrollTo({
                                                        top: document
                                                            .documentElement
                                                            .scrollHeight,
                                                        behavior: "smooth",
                                                    });
                                                    return false;
                                                }}
                                                aria-label="go-down"
                                                icon={<ArrowDownIcon />}
                                            />
                                        </Box>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {upVisible && (
                                        <Box
                                            position="fixed"
                                            right="17vw"
                                            bottom="10vh"
                                        >
                                            <MotionIconButton
                                                colorScheme="teal"
                                                borderRadius="3xl"
                                                animate={{ scale: 1 }}
                                                initial={{ scale: 0 }}
                                                exit={{ scale: 0 }}
                                                onClick={() => {
                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    });
                                                    return false;
                                                }}
                                                icon={<ArrowUpIcon />}
                                                aria-label="go-up"
                                            />
                                        </Box>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <AbsoluteCenter>
                                <Flex
                                    alignItems="center"
                                    flexDirection="column"
                                >
                                    {fileData && (
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
                                    )}
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
