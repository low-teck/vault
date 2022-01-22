import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import DeleteAccount from "./deleteAccount";
import ToggleTheme from "./toggleTheme";

// interface MenuProps {
//     handleSort: (sortCriteria: SortCriteria) => void;
// }

const MotionDrawer = motion(Drawer);

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
            <MotionDrawer
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
                        <Heading size="2xl"> vault menu </Heading>{" "}
                    </DrawerHeader>

                    <DrawerBody>
                        <Flex
                            justifyContent="space-evenly"
                            h="40%"
                            flexDirection="column"
                        >
                            <AddFileItem />
                            <ChangePasswordItem />
                            <ToggleTheme />
                        </Flex>
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
            </MotionDrawer>
        </>
    );
};

export default Menu;
