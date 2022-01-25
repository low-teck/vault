import React from "react";
import {
    Heading,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    UnorderedList,
} from "@chakra-ui/react";
import { FileInfo } from "../../types";
import { ListItem } from "@chakra-ui/react";

const InfoModal = ({
    isOpen,
    onClose,
    modalData,
}: {
    isOpen: boolean;
    onClose: () => void;
    modalData: FileInfo;
}) => {
    return (
        <Modal isOpen={isOpen} size="xl" onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">information</Heading>
                </ModalHeader>
                <ModalBody>
                    <UnorderedList>
                        <ListItem key="filename">
                            <Heading fontWeight="normal" size="md">
                                name:
                            </Heading>

                            {modalData.filename}
                        </ListItem>
                        <ListItem key="path">
                            <Heading fontWeight="normal" size="md">
                                original path:
                            </Heading>
                            {modalData.path}
                        </ListItem>
                        <ListItem key="type">
                            <Heading fontWeight="normal" size="md">
                                file type:
                            </Heading>
                            {modalData.type}
                        </ListItem>
                        <ListItem key="lastMod">
                            <Heading fontWeight="normal" size="md">
                                date last modified:
                            </Heading>
                            {modalData.lastModifiedDate.toString()}
                        </ListItem>
                        <ListItem key="added">
                            <Heading fontWeight="normal" size="md">
                                date added:
                            </Heading>
                            {modalData.date.toString()}
                        </ListItem>
                    </UnorderedList>
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

export default InfoModal;
