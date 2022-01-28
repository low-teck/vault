import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useState } from "react";

interface ISearchItems {
    value: string;
    handleQueryChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchFiles = ({ value, handleQueryChanges }: ISearchItems) => {
    const [foc, setFoc] = useState<boolean>(false);
    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents="none"
                children={
                    !foc ? (
                        <SearchIcon />
                    ) : (
                        <ArrowBackIcon
                            fontSize="xl"
                            onClick={() => {
                                setFoc(false);
                            }}
                        />
                    )
                }
            />
            <Input
                onFocus={() => {
                    setFoc(true);
                }}
                onBlur={() => {
                    setFoc(false);
                }}
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
