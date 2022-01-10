import { AccordionButton, AccordionItem } from "@chakra-ui/react";
import React from "react";

const AddFileItem = () => {
    // TODO
    const handleAddFile = () => {
        console.log("added");
    };

    return (
        <AccordionItem>
            <AccordionButton onClick={handleAddFile}>
                add a file to vault
            </AccordionButton>
        </AccordionItem>
    );
};

export default AddFileItem;
