import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Accordion,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import FilterItem from "./filterItem";
import SortItem from "./sortItem";
import DeleteAccount from "./DeleteAccount";

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
                alignSelf="flex-end"
                margin="2rem"
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
                    <DrawerHeader>vault menu</DrawerHeader>

                    <DrawerBody>
                        <Accordion allowToggle={true}>
                            <AddFileItem />
                            <FilterItem />
                            <SortItem />
                            <ChangePasswordItem />
                        </Accordion>
                    </DrawerBody>

                    <DrawerFooter>
                        <DeleteAccount />
                        <Button variant="ghost" mr={3} onClick={handleLogout}>
                            Logout
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Menu;
