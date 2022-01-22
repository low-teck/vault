import React from "react";
import { Button, useColorMode } from "@chakra-ui/react";

const ToggleTheme = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button
            _focus={{ outline: 0 }}
            variant="unstyled"
            onClick={() => {
                toggleColorMode();
            }}
            fontSize="xl"
            fontWeight="normal"
        >
            toggle theme
        </Button>
    );
};

export default ToggleTheme;
