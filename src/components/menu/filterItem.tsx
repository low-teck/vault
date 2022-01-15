import React from "react";
import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    CheckboxGroup,
    Stack,
} from "@chakra-ui/react";

interface FilterItemProps {
    handleFiltering: (val: number[] | string[]) => void;
}

const FilterItem = () => {
    return (
        <AccordionItem>
            <AccordionButton>filter by file type</AccordionButton>
            <AccordionPanel>
                <CheckboxGroup
                    onChange={(v) => console.log(typeof v.toString())}
                >
                    <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Checkbox value="image">images</Checkbox>
                        <Checkbox value="video">videos</Checkbox>
                        <Checkbox value="file">files</Checkbox>
                        <Checkbox value="saved">saved</Checkbox>
                    </Stack>
                </CheckboxGroup>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default FilterItem;
