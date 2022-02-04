import { InfoIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    FlexProps,
    Heading,
    Icon,
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
import { decrypt, downloadFunc } from "./decrypt";
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
            h="40"
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
            <Icon as={InfoIcon} position="static" right={0} top={0} />
            <MotionFlex
                onClick={handler}
                alignItems="center"
                h="40"
                justifyContent="center"
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
    name,
    refresh,
}: {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    refresh: () => void;
}) => {
    const toast = useToast();
    const getFile = async (name: string) => {
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

        return data;
    };
    return (
        <Modal isOpen={isOpen} size="xl" onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">save</Heading>
                </ModalHeader>
                <ModalBody>
                    <Flex justifyContent="space-evenly" h="100%" w="100%">
                        <ContentFlex
                            handler={async () => {
                                let data = await getFile(name);
                                downloadFunc({
                                    filename: name + ".enc",
                                    text: data.file.file,
                                });
                                refresh();
                            }}
                        >
                            save enc
                        </ContentFlex>
                        <ContentFlex
                            handler={async () => {
                                let data = await getFile(name);
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
