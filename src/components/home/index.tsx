import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    HStack,
    Heading,
    IconButton,
    useToast,
    Center,
    ListItemProps,
    Container,
    Button,
    AbsoluteCenter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    UnorderedList,
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
import { AnimatePresence, motion, usePresence } from "framer-motion";
import Loading from "../loading";
import { FileInfo } from "../../types";
import InfoModal from "./infoModal";
const { ipcRenderer } = window.require("electron");

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

const MotionListItem = motion<ListItemProps>(ListItem);

const CustomMotionListItem = ({ children }: { children: React.ReactNode }) => {
    const [isPresent, safeToRemove] = usePresence();

    const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
    const animations = {
        layout: true,
        initial: "out",
        style: {
            position: isPresent ? "static" : "absolute",
        },
        animate: isPresent ? "in" : "out",
        whileTap: "tapped",
        variants: {
            in: { scaleY: 1, opacity: 1 },
            out: { scaleY: 0, opacity: 0, zIndex: -1 },
            tapped: {
                scale: 0.98,
                opacity: 0.5,
                transition: { duration: 0.1 },
            },
        },
        // @ts-ignore
        onAnimationComplete: () => !isPresent && safeToRemove(),
        transition,
    };
    //@ts-ignore
    return <MotionListItem {...animations}>{children}</MotionListItem>;
};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalData, setModalData] = useState<FileInfo>();
    const [toggle, setToggle] = useState<boolean>();
    const [modalToggle, setModalToggle] = useState<boolean>();
    const [query, setQuery] = useState<string>("");
    const [debouncedQuery] = useDebounce(query, 500);
    const [sort, setSort] = useState<boolean>(false);
    const toast = useToast();

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

    useEffect(() => {
        onOpen();
    }, [modalToggle]);

    const handleQueryChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setQuery(e.target.value);
    };

    return (
        <Box w="100vw" h="100vh" overflowY="scroll" overflowX="hidden">
            <Box position="fixed" zIndex="sticky" margin="4rem">
                <Menu />
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
                                    {sort ? "A-Z" : "Date"}
                                </Button>
                            </HStack>
                            <br />
                            <Heading>my files</Heading>
                        </Box>
                    </Box>
                    <br />
                    {modalData && (
                        <InfoModal
                            onClose={onClose}
                            isOpen={isOpen}
                            modalData={modalData}
                        />
                    )}
                    {!loading ? (
                        <List spacing={5} w="50vw" marginTop="20vh">
                            {[...queryResults]
                                .sort(handleSort)
                                .map((res, index: number) => (
                                    <MotionListItem
                                        whileTap={{
                                            scale: 0.999,
                                            opacity: 0.75,
                                            transition: { duration: 0.25 },
                                        }}
                                        display="flex"
                                        bg="#FAFAFA"
                                        minH="10vh"
                                        borderRadius="md"
                                        onClick={() => {
                                            setModalData(res.item);
                                            setModalToggle(!modalToggle);
                                        }}
                                        key={index}
                                    >
                                        <HStack
                                            marginX="0.5rem"
                                            spacing={5}
                                            justify="space-between"
                                            w="100%"
                                        >
                                            <HStack>
                                                <ListIcon
                                                    as={ArrowRightIcon}
                                                    color="green.500"
                                                />
                                                <Container maxWidth="40vw">
                                                    <Text>
                                                        {res.item.filename}
                                                    </Text>
                                                </Container>
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
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
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
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
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
                                    </MotionListItem>
                                ))}
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
