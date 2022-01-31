import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Box,
    BoxProps,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerContentProps,
    DrawerOverlay,
    Flex,
    FlexProps,
    IconButton,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddFileItem from "./addFile";
import ChangePasswordItem from "./changePasswordItem";
import DeleteAccount from "./deleteAccount";

const MotionBox = motion<BoxProps>(Box);
const MotionFlex = motion<FlexProps>(Flex);
const MotionDrawerContent = motion<DrawerContentProps>(DrawerContent);
const MotionDrawerBody = motion(DrawerBody);

const staggerVariants = {
    closed: {
        transition: {
            staggerChildren: 0.2,
            staggerDirection: -1,
        },
    },
    open: {
        transition: {
            staggerChildren: 0.4,
            staggerDirection: 1,
        },
    },
};

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

const Menu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef(null);
    const navigate = useNavigate();
    const toast = useToast();
    const containerRef = useRef(null);

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
                <AnimatePresence>
                    <MotionDrawerContent
                        backdropFilter="blur(20px)"
                        background="transparent"
                        initial={false}
                        animate={isOpen ? "open" : "closed"}
                        custom="100%"
                        ref={containerRef}
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

                        <MotionDrawerBody>
                            <MotionFlex
                                variants={staggerVariants}
                                justifyContent="space-evenly"
                                animate="open"
                                exit="closed"
                                initial="closed"
                                alignItems="center"
                                h="100%"
                                w="100%"
                                fontSize="3xl"
                                color="white"
                                flexDirection="column"
                            >
                                <MotionBox
                                    whileHover={{
                                        translateY: "-0.5rem",
                                        transition: {
                                            type: "spring",
                                            bounce: 0.6,
                                            velocity: 0.5,
                                        },
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    variants={variants}
                                >
                                    <AddFileItem />
                                </MotionBox>
                                <MotionBox
                                    whileHover={{
                                        translateY: "-1rem",
                                        transition: {
                                            type: "spring",
                                            bounce: 0.6,
                                            velocity: 0.5,
                                        },
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    variants={variants}
                                >
                                    <ChangePasswordItem />
                                </MotionBox>
                                <MotionBox
                                    whileHover={{
                                        translateY: "-1rem",
                                        transition: {
                                            type: "spring",
                                            bounce: 0.6,
                                            velocity: 0.5,
                                        },
                                    }}
                                    variants={variants}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Text
                                        onClick={handleLogout}
                                        cursor="pointer"
                                    >
                                        logout
                                    </Text>
                                </MotionBox>
                                <MotionBox
                                    whileHover={{
                                        translateY: "-1rem",
                                        transition: {
                                            type: "spring",
                                            bounce: 0.6,
                                            velocity: 0.5,
                                        },
                                    }}
                                    variants={variants}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <DeleteAccount />
                                </MotionBox>
                            </MotionFlex>
                        </MotionDrawerBody>
                    </MotionDrawerContent>
                </AnimatePresence>
            </Drawer>
        </>
    );
};

export default Menu;
