import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    Checkbox,
    CheckboxGroup,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormItem } from "../../formHelpers";
import ChangePassword from "./changePasswordForm";

const Menu = () => {
    const [sortCriteria, setSortCriteria] = useState("date");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef(null);
    const navigate = useNavigate();
    const toast = useToast();

    // TODO
    const handleAddFile = () => {
        console.log("added");
    };

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
                            <AccordionItem>
                                <AccordionButton onClick={handleAddFile}>
                                    add a file to vault
                                </AccordionButton>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionButton>
                                    filter by file type
                                </AccordionButton>
                                <AccordionPanel>
                                    <CheckboxGroup>
                                        <Stack
                                            spacing={[1, 5]}
                                            direction={["column", "row"]}
                                        >
                                            <Checkbox>images</Checkbox>
                                            <Checkbox>videos</Checkbox>
                                            <Checkbox>files</Checkbox>
                                        </Stack>
                                    </CheckboxGroup>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionButton>sort by</AccordionButton>
                                <AccordionPanel>
                                    <RadioGroup
                                        onChange={setSortCriteria}
                                        value={sortCriteria}
                                    >
                                        <Stack
                                            spacing={[1, 5]}
                                            direction={["column", "row"]}
                                        >
                                            <Radio value="date">
                                                date added
                                            </Radio>
                                            <Radio value="name">name</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionButton>
                                    change password
                                </AccordionButton>
                                <AccordionPanel>
                                    <ChangePassword />
                                </AccordionPanel>
                            </AccordionItem>
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
