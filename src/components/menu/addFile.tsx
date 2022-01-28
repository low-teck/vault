import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AddFileItem = () => {
    const navigate = useNavigate();
    const handleAddFile = () => {
        navigate("/upload");
    };

    return (
        <Text onClick={handleAddFile} cursor="pointer">
            add a file to vault
        </Text>
    );
};

export default AddFileItem;
