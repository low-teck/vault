import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Radio,
    RadioGroup,
    Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SortCriteria, SortItemProps } from "../../types";

const SortItem = ({ handleSort }: SortItemProps) => {
    const [sortCriteria, setSortCriteria] = useState<SortCriteria>("date");

    const handleSortCriteriaChange = (e: SortCriteria) => {
        handleSort(e);
        setSortCriteria(e);
    };

    return (
        <AccordionItem>
            <AccordionButton>sort by</AccordionButton>
            <AccordionPanel>
                <RadioGroup
                    onChange={handleSortCriteriaChange}
                    value={sortCriteria}
                >
                    <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Radio value="date">date added</Radio>
                        <Radio value="filename">name</Radio>
                    </Stack>
                </RadioGroup>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default SortItem;
