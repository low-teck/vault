import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Radio,
    RadioGroup,
    Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SortItem = () => {
    const [sortCriteria, setSortCriteria] = useState("date");
    return (
        <AccordionItem>
            <AccordionButton>sort by</AccordionButton>
            <AccordionPanel>
                <RadioGroup onChange={setSortCriteria} value={sortCriteria}>
                    <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Radio value="date">date added</Radio>
                        <Radio value="name">name</Radio>
                    </Stack>
                </RadioGroup>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default SortItem;
