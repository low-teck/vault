import { Button, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddFileItem = () => {
    const navigate = useNavigate();
    const handleAddFile = () => {
        navigate("/upload");
    };

    return (
        <Button
            _focus={{ outline: 0 }}
            variant="unstyled"
            onClick={handleAddFile}
            fontSize="xl"
            fontWeight="normal"
        >
            add a file to vault
        </Button>
    );
};

export default AddFileItem;
