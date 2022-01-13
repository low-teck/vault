import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Container,
    Stack,
    Text,
    HStack,
    Heading,
    IconButton,
    useToast,
    Input,
} from "@chakra-ui/react";
import Menu from "./menu";
import { List, ListItem, ListIcon, Divider } from "@chakra-ui/react";
import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import CryptoJS from "crypto-js";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce/lib";
import { FormItem } from "../formHelpers";
import * as _ from "lodash";
const { ipcRenderer } = window.require("electron");

interface FileInfo {
    filename: string;
    saved: Boolean;
}

const fuseOptions: Fuse.IFuseOptions<FileInfo> = {
    includeScore: true,
    keys: ["filename"],
};

const Home = () => {
    const [fileData, setFileData] = useState<FileInfo[]>([]);
    const [queryResults, setQueryResults] = useState<
        Fuse.FuseResult<FileInfo>[]
    >([]);
    const [toggle, setToggle] = useState<boolean>();
    const [query, setQuery] = useState<string>("");
    const [debouncedQuery] = useDebounce(query, 500);

    const toast = useToast();

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFileData(data);
    };

    useEffect(() => {
        let fuse = new Fuse(fileData, fuseOptions);
        let res = debouncedQuery
            ? fuse.search(debouncedQuery)
            : _.map<FileInfo, Fuse.FuseResult<FileInfo>>(
                  fileData,
                  (item, index) => ({
                      item,
                      refIndex: index,
                      matches: [],
                      score: 1,
                  })
              );
        setQueryResults(res);
    }, [debouncedQuery, fileData]);

    useEffect(() => {
        getData();
    }, [toggle]);

    const decrypt = async (input: any) => {
        var file = input.file.file;
        let key = await ipcRenderer.invoke("GET_KEY");
        var decrypted = CryptoJS.AES.decrypt(file, key);
        // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted);
        // Convert: WordArray -> typed array

        var fileDec = new Blob([typedArray]); // Create blob from typed array

        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var filename = input.file.filename;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const convertWordArrayToUint8Array = (
        wordArray: CryptoJS.lib.WordArray
    ) => {
        var arrayOfWords = wordArray.hasOwnProperty("words")
            ? wordArray.words
            : [];
        var length = wordArray.hasOwnProperty("sigBytes")
            ? wordArray.sigBytes
            : arrayOfWords.length * 4;
        var uInt8Array = new Uint8Array(length),
            index = 0,
            word,
            i;
        for (i = 0; i < length; i++) {
            word = arrayOfWords[i];
            uInt8Array[index++] = word >> 24;
            uInt8Array[index++] = (word >> 16) & 0xff;
            uInt8Array[index++] = (word >> 8) & 0xff;
            uInt8Array[index++] = word & 0xff;
        }
        return uInt8Array;
    };
    return (
        <Box w="100vw" h="100vh">
            <Box>
                <Menu />
            </Box>
            <Container>
                <Input
                    value={query}
                    onChange={(e) => {
                        e.preventDefault();
                        setQuery(e.target.value);
                    }}
                    variant="filled"
                    placeholder={"search your files"}
                />
                <br />
                <br />
                <Heading>my files</Heading>
                <br />
                {fileData && (
                    <List spacing={5}>
                        {queryResults.map((res) => (
                            <>
                                {true && (
                                    <>
                                        <ListItem key={res.item.filename}>
                                            <HStack
                                                spacing={5}
                                                justify="space-between"
                                            >
                                                <HStack>
                                                    <ListIcon
                                                        as={ArrowRightIcon}
                                                        color="green.500"
                                                    />
                                                    <Text>
                                                        {res.item.filename}
                                                    </Text>
                                                </HStack>
                                                <HStack>
                                                    <IconButton
                                                        aria-label={`download ${res.item.filename}`}
                                                        variant="ghost"
                                                        icon={
                                                            <DownloadIcon
                                                                w={4}
                                                                h={4}
                                                            />
                                                        }
                                                        onClick={async () => {
                                                            let name =
                                                                res.item
                                                                    .filename;
                                                            let data =
                                                                await ipcRenderer.invoke(
                                                                    "DEC_FILE",
                                                                    { name }
                                                                );
                                                            if (data) {
                                                                toast({
                                                                    title: `downloaded ${name}`,
                                                                    variant:
                                                                        "left-accent",
                                                                    status: "success",
                                                                    isClosable:
                                                                        true,
                                                                });
                                                            } else {
                                                                toast({
                                                                    title: `some error occured, try again :(`,
                                                                    variant:
                                                                        "left-accent",
                                                                    status: "error",
                                                                    isClosable:
                                                                        true,
                                                                });
                                                            }
                                                            await decrypt(data);
                                                            await ipcRenderer.invoke(
                                                                "SAVE_STATE",
                                                                { name }
                                                            );
                                                            setToggle(!toggle);
                                                        }}
                                                    />
                                                    {res.item.saved && (
                                                        <IconButton
                                                            aria-label={`delete ${res.item.filename}`}
                                                            variant="ghost"
                                                            icon={
                                                                <DeleteIcon
                                                                    w={4}
                                                                    h={4}
                                                                />
                                                            }
                                                            onClick={async () => {
                                                                let name =
                                                                    res.item
                                                                        .filename;
                                                                await ipcRenderer.invoke(
                                                                    "DELETE_FILE",
                                                                    { name }
                                                                );
                                                                setToggle(
                                                                    !toggle
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </HStack>
                                            </HStack>
                                        </ListItem>
                                        <Divider />
                                    </>
                                )}
                            </>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default Home;
