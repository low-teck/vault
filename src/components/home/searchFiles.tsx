import { Input } from "@chakra-ui/react";
import React from "react";

interface ISearchItems {
    value: string;
    handleQueryChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchFiles = ({ value, handleQueryChanges }: ISearchItems) => {
    return (
        <Input
            value={value}
            onChange={handleQueryChanges}
            variant="filled"
            placeholder="search your files"
        />
    );
};

export default SearchFiles;
