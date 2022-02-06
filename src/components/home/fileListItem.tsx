import React, { ReactNode, useEffect, useState } from "react";
import {
    Text,
    HStack,
    IconButton,
    useToast,
    ListItemProps,
    Container,
    useDisclosure,
    useColorModeValue,
    MenuButton,
    Menu,
    Button,
    MenuList,
    MenuItem,
    MenuDivider,
    Portal,
    Tooltip,
} from "@chakra-ui/react";
import { ListItem, ListIcon } from "@chakra-ui/react";
import {
    ArrowRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DeleteIcon,
} from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import Fuse from "fuse.js";
import { decrypt, downloadFunc } from "./decrypt";
import { motion, usePresence } from "framer-motion";
import { FileInfo } from "../../types";
import InfoModal from "./infoModal";
import DownloadModal from "./downloadModal";
const { ipcRenderer } = window.require("electron");

const MotionListItem = motion<ListItemProps>(ListItem);
const MotionListIcon = motion(ListIcon);

interface FileListItemProps {
    res: Fuse.FuseResult<FileInfo>;
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

const MotionFileListItem = ({
    children,
    onOpen,
    toggle,
}: {
    children: ReactNode;
    onOpen: () => void;
    toggle: (value: boolean) => void;
}) => {
    const [isPresent, safeToRemove] = usePresence();
    const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
    const animations = {
        layout: true,
        initial: "out",
        style: {
            position: isPresent ? "static" : "absolute",
        },
        // whileTap: "tapped",
        animate: isPresent ? "in" : "out",
        variants: {
            in: { opacity: 1 },
            out: { opacity: 0 },
            tapped: {
                scale: 0.99,
                opacity: 0.75,
                transition: { duration: 0.25 },
            },
        },
        // @ts-ignore
        onAnimationComplete: () => !isPresent && safeToRemove(),
        transition,
    };
    const listBg = useColorModeValue("#FAFAFA", "gray.700");
    return (
        //@ts-ignore
        <MotionListItem
            {...animations}
            bg={listBg}
            onMouseEnter={() => {
                toggle(true);
            }}
            whileHover={{
                opacity: 0.8,
            }}
            whileTap={{
                scale: 0.96,
            }}
            onMouseLeave={() => {
                toggle(false);
            }}
            display="flex"
            minH="10vh"
            borderRadius="md"
            onClick={() => {
                onOpen();
                toggle(false);
            }}
        >
            {children}
        </MotionListItem>
    );
};

const FileListItem = ({ res, refresh }: FileListItemProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDownloadOpen,
        onOpen: onDownloadOpen,
        onClose: onDownloadClose,
    } = useDisclosure();
    const toast = useToast();
    const [on, toggle] = useState(false);

    const getFile = async (name: string, enc: boolean) => {
        let data = await ipcRenderer.invoke("DEC_FILE", {
            name,
        });
        if (data) {
            toast({
                title: `saved ${enc ? "encrypted " : ""}${name}`,
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

        return data;
    };
    return (
        <MotionFileListItem key={res.refIndex} toggle={toggle} onOpen={onOpen}>
            <>
                <InfoModal
                    onClose={onClose}
                    isOpen={isOpen}
                    modalData={res.item}
                />
                <DownloadModal
                    refresh={refresh}
                    onClose={onDownloadClose}
                    isOpen={isDownloadOpen}
                    name={res.item.filename}
                />
                <HStack
                    marginX="1rem"
                    spacing={5}
                    justify="space-between"
                    w="50vw"
                >
                    <HStack maxW="30vw">
                        <MotionListIcon
                            initial="closed"
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
                        {/* <IconButton */}
                        {/*     aria-label={`download ${res.item.filename}`} */}
                        {/*     variant="ghost" */}
                        {/*     icon={<DownloadIcon w={4} h={4} />} */}
                        {/*     onClick={async (e) => { */}
                        {/*         e.stopPropagation(); */}
                        {/*         onDownloadOpen(); */}
                        {/*     }} */}
                        {/* /> */}

                        <Menu>
                            {({ isOpen }) => (
                                <>
                                    <MenuButton
                                        as={IconButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        icon={
                                            isOpen ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )
                                        }
                                        variant="ghost"
                                    />
                                    <Portal>
                                        <MenuList>
                                            <MenuItem
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    let name =
                                                        res.item.filename;
                                                    let data = await getFile(
                                                        name,
                                                        true
                                                    );
                                                    downloadFunc({
                                                        filename: name + ".enc",
                                                        text: data.file.file,
                                                    });
                                                    refresh();
                                                }}
                                            >
                                                save encrypted
                                            </MenuItem>
                                            <MenuItem
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    let name =
                                                        res.item.filename;
                                                    let data = await getFile(
                                                        name,
                                                        false
                                                    );
                                                    await decrypt(data);
                                                    await ipcRenderer.invoke(
                                                        "SAVE_STATE",
                                                        {
                                                            name,
                                                        }
                                                    );
                                                    refresh();
                                                }}
                                            >
                                                save original
                                            </MenuItem>
                                            <MenuDivider />
                                            <Tooltip
                                                label="save the original file to safely remove"
                                                isDisabled={res.item.saved}
                                            >
                                                <span>
                                                    <MenuItem
                                                        isDisabled={
                                                            !res.item.saved
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
                                                            refresh();
                                                        }}
                                                    >
                                                        remove
                                                    </MenuItem>
                                                </span>
                                            </Tooltip>
                                        </MenuList>
                                    </Portal>
                                </>
                            )}
                        </Menu>
                    </HStack>
                </HStack>
            </>
        </MotionFileListItem>
    );
};

export default FileListItem;
