import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

interface ISearchItems {
    value: string;
    handleQueryChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchFiles = ({ value, handleQueryChanges }: ISearchItems) => {
    return (
        <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
                boxSizing="border-box"
                value={value}
                focusBorderColor="teal.500"
                onChange={handleQueryChanges}
                variant="filled"
                placeholder="search your files"
            />
        </InputGroup>
    );
};

export default SearchFiles;
