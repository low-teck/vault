import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import ChangePasswordForm from "./changePasswordForm";

const ChangePasswordItem = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Text fontSize="3xl" cursor="pointer" onClick={onOpen}>
                change password
            </Text>
            <Modal isOpen={isOpen} isCentered onClose={onClose}>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent>
                    <ModalHeader>change password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ChangePasswordForm />
                    </ModalBody>
                    <br />
                </ModalContent>
            </Modal>
        </>
    );
};

export default ChangePasswordItem;
