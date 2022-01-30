import React, { useEffect, useState } from "react";
import {
    Text,
    HStack,
    IconButton,
    useToast,
    ListItemProps,
    Container,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { ListItem, ListIcon } from "@chakra-ui/react";
import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import Fuse from "fuse.js";
import * as _ from "lodash";
import { decrypt } from "./decrypt";
import { motion } from "framer-motion";
import { FileInfo } from "../../types";
import InfoModal from "./infoModal";
const { ipcRenderer } = window.require("electron");

const MotionListItem = motion<ListItemProps>(ListItem);
const MotionListIcon = motion(ListIcon);

interface FileListItemProps {
    res: Fuse.FuseResult<FileInfo>;
    index: number;
    refresh: () => void;
}

const variants = {
    open: {
        opacity: 1,
        x: 0,
        transition: {
            x: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        opacity: 0,
        x: "-1rem",
        transition: {
            x: { stiffness: 1000 },
        },
    },
};

const FileListItem = ({ res, index, refresh }: FileListItemProps) => {
    const toast = useToast();
    const [on, toggle] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const listBg = useColorModeValue("#FAFAFA", "gray.700");
    return (
        <MotionListItem
            whileTap={{
                scale: 0.99,
                opacity: 0.75,
                transition: { duration: 0.25 },
            }}
            bg={listBg}
            onMouseEnter={() => {
                toggle(true);
            }}
            onMouseLeave={() => {
                toggle(false);
            }}
            display="flex"
            minH="10vh"
            whileHover={{
                translateY: "-0.3rem",
            }}
            borderRadius="md"
            onClick={() => {
                onOpen();
                toggle(false);
            }}
            key={index}
        >
            <InfoModal onClose={onClose} isOpen={isOpen} modalData={res.item} />
            <HStack marginX="1rem" spacing={5} justify="space-between" w="50vw">
                <HStack maxW="30vw">
                    <MotionListIcon
                        animate={on ? "open" : "closed"}
                        variants={variants}
                        as={ArrowRightIcon}
                        color="green.500"
                    />
                    <Container maxW="100%">
                        <Text>{res.item.filename}</Text>
                    </Container>
                </HStack>
                <HStack>
                    <IconButton
                        aria-label={`download ${res.item.filename}`}
                        variant="ghost"
                        icon={<DownloadIcon w={4} h={4} />}
                        onClick={async (e) => {
                            e.stopPropagation();
                            let name = res.item.filename;
                            let data = await ipcRenderer.invoke("DEC_FILE", {
                                name,
                            });
                            if (data) {
                                toast({
                                    title: `downloaded ${name}`,
                                    variant: "left-accent",
                                    status: "success",
                                    isClosable: true,
                                });
                            } else {
                                toast({
                                    title: `some error occured, try again :(`,
                                    variant: "left-accent",
                                    status: "error",
                                    isClosable: true,
                                });
                            }
                            await decrypt(data);
                            await ipcRenderer.invoke("SAVE_STATE", {
                                name,
                            });
                            refresh();
                        }}
                    />
                    {res.item.saved && (
                        <IconButton
                            aria-label={`delete ${res.item.filename}`}
                            variant="ghost"
                            colorScheme="red"
                            icon={<DeleteIcon w={4} h={4} />}
                            onClick={async (e) => {
                                e.stopPropagation();
                                let name = res.item.filename;
                                await ipcRenderer.invoke("DELETE_FILE", {
                                    name,
                                });
                                refresh();
                            }}
                        />
                    )}
                </HStack>
            </HStack>
        </MotionListItem>
    );
};

export default FileListItem;
