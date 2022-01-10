import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import FilterItem from "./filterItem";
import SortItem from "./sortItem";

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
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
                Menu
            </Button>
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
                        <Button variant="ghost" mr={3} onClick={handleLogout}>
                            logout
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Menu;
