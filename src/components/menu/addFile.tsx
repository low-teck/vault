import { AccordionButton, AccordionItem } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddFileItem = () => {
    const navigate = useNavigate();
    const handleAddFile = () => {
        navigate("/upload");
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
