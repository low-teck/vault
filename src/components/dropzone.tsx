import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Input,
    List,
    ListItem,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

interface FileWithPreview extends File {
    preview: string;
}

const FileDropzone = () => {
    const [files, setFiles] = useState<Array<FileWithPreview>>();
    const navigate = useNavigate();
    const toast = useToast();
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: Array<File>) => {
            let files = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setFiles(files);
        },
    });

    useEffect(
        () => () => {
            files &&
                files.forEach((file: FileWithPreview) =>
                    URL.revokeObjectURL(file.preview)
                );
        },
        [files]
    );

    const thumbs =
        files &&
        files.map((file: FileWithPreview) => {
            return (
                file && (
                    // @ts-ignore
                    <ListItem key={file.path}>
                        {/* @ts-ignore */}
                        {file.path} - {file.size} bytes
                        {/* <Img w="xs" h="xs" src={file.preview} /> */}
                        {/* CAN'T USE LINK HERE [LINK] */}
                        {/* <Link download href={file.preview} target="_blank">
							<Button>Download</Button>
						</Link> */}
                    </ListItem>
                )
            );
        });

    const encrypt = (input: File) => {
        var file = input;
        var reader = new FileReader();
        reader.onload = async () => {
            let key = await ipcRenderer.invoke("GET_KEY");
            // @ts-ignore
            var wordArray = CryptoJS.lib.WordArray.create(reader.result); // Convert: ArrayBuffer -> WordArray
            var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

            const result = await ipcRenderer.invoke("ENC_FILE", {
                file: encrypted,
                filename: file.name,
            });
            if (result === "DONE") {
                toast({
                    title: `${file.name} saved! you can now delete the original file :)`,
                    isClosable: true,
                    variant: "left-accent",
                    status: "success",
                });
            }
        };
        reader.readAsArrayBuffer(file);
        navigate("/home");
    };

    const decrypt = (input: File) => {
        var file = input;
        var reader = new FileReader();
        reader.onload = () => {
            var key = "1234567887654321";
            if (!reader.result) return;
            // @ts-ignore
            var decrypted = CryptoJS.AES.decrypt(reader.result, key); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
            var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array

            var fileDec = new Blob([typedArray]); // Create blob from typed array

            var a = document.createElement("a");
            var url = window.URL.createObjectURL(fileDec);
            var filename = file.name.substr(0, file.name.length - 4);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        };
        reader.readAsText(file);
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
        <Box>
            <Box>
                <Link to="/home">
                    <Button
                        size="md"
                        height="48px"
                        width="200px"
                        border="2px"
                        borderColor="green.500"
                    >
                        Back
                    </Button>
                </Link>
            </Box>
            <Box bg="black" {...getRootProps({ className: "dropzone" })}>
                <Center w="60vw" h="20vh">
                    {/* @ts-ignore */}
                    <Input {...getInputProps()} />
                    <Text>Drag 'n' drop or touch to add files</Text>
                </Center>
            </Box>
            <List>
                {thumbs}
                <ListItem key="encrypt-file">
                    {files && (
                        <Button onClick={() => encrypt(files[0])}>
                            Encrypt
                        </Button>
                    )}
                </ListItem>
                {/* <ListItem key="decrypt-file">
                    {files && (
                        <Button onClick={() => decrypt(files[0])}>
                            Decrypt
                        </Button>
                    )}
                </ListItem> */}
            </List>
        </Box>
    );
};

export default FileDropzone;
