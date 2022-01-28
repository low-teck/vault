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
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import DeleteAccount from "./deleteAccount";

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
                size="full"
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    backdropFilter="blur(20px)"
                    background="transparent"
                >
                    <DrawerCloseButton
                        color="white"
                        _focus={{ outline: 0 }}
                        position="absolute"
                        left={0}
                        top={0}
                        size="lg"
                        margin="4rem"
                    />
                    {/* <DrawerHeader> */}
                    {/*     <Heading size="2xl"> vault menu </Heading>{" "} */}
                    {/* </DrawerHeader> */}

                    <DrawerBody>
                        <Flex
                            justifyContent="space-evenly"
                            alignItems="center"
                            h="100%"
                            w="100%"
                            fontSize="3xl"
                            color="white"
                            flexDirection="column"
                        >
                            <AddFileItem />
                            <ChangePasswordItem />
                            <Text onClick={handleLogout} cursor="pointer">
                                logout
                            </Text>
                            <DeleteAccount />
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Menu;
