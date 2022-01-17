import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Accordion,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Heading,
    IconButton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import DeleteAccount from "./deleteAccount";

// interface MenuProps {
//     handleSort: (sortCriteria: SortCriteria) => void;
// }

const Menu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef(null);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = () => {
        toast({
            title: "logged out!",
            variant: "left-accent",
            isClosable: true,
            status: "info",
        });
        navigate("/login");
    };

    return (
        <>
            <IconButton
                aria-label="menu"
                ref={btnRef}
                colorScheme="teal"
                onClick={onOpen}
                icon={<HamburgerIcon />}
            />
            <Drawer
                size="sm"
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        {" "}
                        <Heading as="h2"> vault menu </Heading>{" "}
                    </DrawerHeader>

                    <DrawerBody>
                        <Accordion allowToggle={true}>
                            <AddFileItem />
                            <ChangePasswordItem />
                        </Accordion>
                    </DrawerBody>

                    <DrawerFooter>
                        <DeleteAccount />
                        <Button
                            marginLeft="1rem"
                            variant="ghost"
                            mr={3}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Menu;
