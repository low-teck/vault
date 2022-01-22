import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
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
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>change password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ChangePasswordForm />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ChangePasswordItem;
