import React, { ReactNode, useState } from "react";
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
    MenuList,
    MenuItem,
    MenuDivider,
    Portal,
    Tooltip,
    Icon,
} from "@chakra-ui/react";
import { ListItem, ListIcon } from "@chakra-ui/react";
import {
    ArrowRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@chakra-ui/icons";
import Fuse from "fuse.js";
import { decrypt, downloadFunc } from "./decrypt";
import { motion, usePresence } from "framer-motion";
import { FileInfo } from "../../types";
import InfoModal from "./infoModal";
import DownloadModal from "./downloadModal";
const { ipcRenderer } = window.require("electron");

const MotionListItem = motion<ListItemProps>(ListItem);
const MotionListIcon = motion(Icon);

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
    const listBg = useColorModeValue("#FAFAFA", "gray.700");
    return (
        //@ts-ignore
        <motion.li
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
            style={{
                minHeight: "10vh",
                backgroundColor: listBg,
                borderRadius: "20px",
                display: "flex",
            }}
            onClick={() => {
                onOpen();
                toggle(false);
            }}
        >
            {children}
        </motion.li>
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
