import React from "react";
import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    CheckboxGroup,
    Stack,
} from "@chakra-ui/react";

const FilterItem = () => {
    return (
        <AccordionItem>
            <AccordionButton>filter by file type</AccordionButton>
            <AccordionPanel>
                <CheckboxGroup>
                    <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Checkbox>images</Checkbox>
                        <Checkbox>videos</Checkbox>
                        <Checkbox>files</Checkbox>
                    </Stack>
                </CheckboxGroup>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default FilterItem;
