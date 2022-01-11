import React, { useState, useRef } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    useToast,
    Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const DeleteAccount = () => {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        //handle deletion
        ipcRenderer.invoke("DELETE_ACCOUNT");
        toast({
            title: "account deleted",
            isClosable: true,
            variant: "left-accent",
            status: "info",
        });
        setIsOpen(false);
        navigate("/signup");
    };

    return (
        <>
            <Button
                colorScheme="red"
                variant="ghost"
                onClick={() => setIsOpen(true)}
            >
                delete account
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            delete account?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            are you sure? deleting account will lead to the
                            deletion of all the encrypted files and your
                            personal key
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                variant="ghost"
                                onClick={onClose}
                            >
                                cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                ml={3}
                                variant="ghost"
                            >
                                delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default DeleteAccount;
