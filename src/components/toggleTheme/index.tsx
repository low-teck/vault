import React from "react";
import {
    useColorMode,
    useColorModeValue,
    IconButton,
    IconButtonProps,
} from "@chakra-ui/react";
import { MoonIcon } from "./moonIcon";
import { SunIcon } from "./sunIcon";

const ThemeModeToggler = (props: IconButtonProps) => {
    const { toggleColorMode } = useColorMode();
    const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

    return (
        <IconButton
            fontSize="4xl"
            variant="ghost"
            position="absolute"
            right={0}
            margin="4rem"
            onClick={() => toggleColorMode()}
            icon={<SwitchIcon />}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            style={{ boxShadow: "none" }}
            {...props}
        />
    );
};

export default ThemeModeToggler;
