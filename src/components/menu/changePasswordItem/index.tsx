import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import ChangePasswordForm from "./changePasswordForm";

const ChangePasswordItem = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                _focus={{ outline: 0 }}
                variant="unstyled"
                fontWeight="normal"
                onClick={onOpen}
                fontSize="xl"
            >
                change password
            </Button>
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
