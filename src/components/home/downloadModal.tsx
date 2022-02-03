import {
    Button,
    Flex,
    FlexProps,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { FileInfo } from "../../types";
import { decrypt } from "./decrypt";
const { ipcRenderer } = window.require("electron");

const MotionFlex = motion<FlexProps>(Flex);

const ContentFlex = ({
    children,
    handler,
}: {
    children: ReactNode;
    handler: () => void;
}) => {
    return (
        <MotionFlex
            borderWidth="2px"
            h="sm"
            whileHover={{
                borderStyle: "solid",
                borderRadius: "20px",
                transition: { duration: 0.2 },
            }}
            w="45%"
            alignItems="center"
            justifyContent="center"
            borderStyle="dashed"
        >
            <MotionFlex
                onClick={handler}
                alignItems="center"
                justifyContent="center"
                h="sm"
                w="100%"
                userSelect="none"
                whileTap={{ scale: 0.95 }}
            >
                {children}
            </MotionFlex>
        </MotionFlex>
    );
};

const DownloadModal = ({
    isOpen,
    onClose,
    modalData,
    refresh,
}: {
    isOpen: boolean;
    onClose: () => void;
    modalData: FileInfo;
    refresh: () => void;
}) => {
    const toast = useToast();
    return (
        <Modal isOpen={isOpen} size="2xl" onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">save</Heading>
                </ModalHeader>
                <ModalBody>
                    <Flex justifyContent="space-evenly" h="100%" w="100%">
                        <ContentFlex
                            handler={async () => {
                                let name = modalData.filename;
                                let data = await ipcRenderer.invoke(
                                    "NO_DEC_GET",
                                    {
                                        name,
                                    }
                                );
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
                            }}
                        >
                            save enc
                        </ContentFlex>
                        <ContentFlex
                            handler={async () => {
                                let name = modalData.filename;
                                let data = await ipcRenderer.invoke(
                                    "DEC_FILE",
                                    {
                                        name,
                                    }
                                );
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
                        >
                            save
                        </ContentFlex>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="teal"
                        mr={3}
                        variant="ghost"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DownloadModal;
