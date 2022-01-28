import { Progress } from "@chakra-ui/react";
import React from "react";

const Strength = ({ value }: { value: number }) => {
    return (
        <Progress
            sx={{
                "& > div:first-child": {
                    transitionProperty: "width",
                },
            }}
            size="sm"
            borderRadius="10px"
            colorScheme={value < 48 ? "red" : value < 80 ? "yellow" : "teal"}
            value={value}
        />
    );
};

export default Strength;
