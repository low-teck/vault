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
} from "@chakra-ui/react";
import Menu from "./menu";
import { List, ListItem, ListIcon, Divider } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { DownloadIcon } from "@chakra-ui/icons";
import CryptoJS from "crypto-js";
const { ipcRenderer } = window.require("electron");

const Home = () => {
    const [filenames, setFilenames] = useState<String[]>([]);
    const toast = useToast();

    const getData = async () => {
        const data = await ipcRenderer.invoke("GET_DATA");
        setFilenames(data);
    };

    useEffect(() => {
        getData();
    });

    const decrypt = async (input: any) => {
        var file = input.file.file;
        let key = await ipcRenderer.invoke("GET_KEY");
        var decrypted = CryptoJS.AES.decrypt(file, key); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array

        var fileDec = new Blob([typedArray]); // Create blob from typed array

        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var filename = input.file.filename;
        console.log(input.file);
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
            <Stack spacing={4} direction="row">
                <Menu />
            </Stack>
            <Container>
                <Heading>my files</Heading>
                <br />
                {filenames && (
                    <List spacing={5}>
                        {filenames.map((filename: any) => (
                            <>
                                <ListItem key={filename}>
                                    <HStack spacing={5} justify="space-between">
                                        <HStack>
                                            <ListIcon
                                                as={ArrowRightIcon}
                                                color="green.500"
                                            />
                                            <Text>{filename}</Text>
                                        </HStack>
                                        <IconButton
                                            aria-label={`download ${filename}`}
                                            variant="ghost"
                                            icon={<DownloadIcon w={6} h={6} />}
                                            onClick={async () => {
                                                let data =
                                                    await ipcRenderer.invoke(
                                                        "DOWNLOAD_FILE",
                                                        { filename }
                                                    );

                                                decrypt(data);
                                            }}
                                        />
                                    </HStack>
                                </ListItem>
                                <Divider />
                            </>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default Home;
