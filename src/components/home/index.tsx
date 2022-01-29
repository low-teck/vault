import React, { useEffect, useState } from "react";
import {
    Box,
    HStack,
    Heading,
    Center,
    Button,
    AbsoluteCenter,
    useColorModeValue,
} from "@chakra-ui/react";
import Menu from "../menu";
import { List } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce/lib";
import * as _ from "lodash";
import SearchFiles from "./searchFiles";
import { usePresence } from "framer-motion";
import Loading from "../loading";
import { FileInfo } from "../../types";
import FileListItem from "./fileListItem";
const { ipcRenderer } = window.require("electron");

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

//const CustomMotionListItem = ({ children }: { children: React.ReactNode }) => {
//    const [isPresent, safeToRemove] = usePresence();
//    const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
//    const animations = {
//        layout: true,
//        initial: "out",
//        style: {
//            position: isPresent ? "static" : "absolute",
//        },
//        animate: isPresent ? "in" : "out",
//        whileTap: "tapped",
//        variants: {
//            in: { scaleY: 1, opacity: 1 },
//            out: { scaleY: 0, opacity: 0, zIndex: -1 },
//            tapped: {
//                scale: 0.98,
//                opacity: 0.5,
//                transition: { duration: 0.1 },
//            },
//        },
//        // @ts-ignore
//        onAnimationComplete: () => !isPresent && safeToRemove(),
//        transition,
//    };
//    //@ts-ignore
//    return <MotionListItem {...animations}>{children}</MotionListItem>;
//};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const barBg = useColorModeValue("white", "gray.800");
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
                            </HStack>
                            <br />
                            <Heading>my files</Heading>
                        </Box>
                    </Box>
                    <br />

                    {!loading ? (
                        <List
                            spacing={5}
                            w="50vw"
                            position="relative"
                            marginTop="20vh"
                        >
                            {[...queryResults]
                                .sort(handleSort)
                                .map((res, index: number) => {
                                    return (
                                        <FileListItem
                                            res={res}
                                            index={index}
                                            refresh={refresh}
                                        />
                                    );
                                })}
                        </List>
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
