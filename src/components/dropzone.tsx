import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Container,
    IconButton,
    Input,
    List,
    ListItem,
    Text,
    useToast,
    Divider,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import CryptoJS from "crypto-js";
const { ipcRenderer } = window.require("electron");

interface FileWithPreview extends File {
    preview: string;
}

const FileDropzone = () => {
    const [files, setFiles] = useState<Array<FileWithPreview>>();
    const [loading, setLoading] = useState<boolean>(false);
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
                    <>
                        {/* @ts-ignore */}
                        <ListItem key={file.path}>
                            {/* @ts-ignore */}
                            {file.path} - {file.size} bytes
                        </ListItem>
                        <Divider />
                    </>
                )
            );
        });

    const encrypt = async (input: File) => {
        setLoading(true);
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
                type: file.type.split("/")[1],
                saved: false,
            });

            if (result === "DONE") {
                toast({
                    title: `${file.name} saved! you can now delete the original file :)`,
                    isClosable: true,
                    variant: "left-accent",
                    position: "top-right",
                    status: "success",
                });
            }
            setLoading(false);
        };
        await reader.readAsArrayBuffer(file);
    };

    return (
        <Box>
            <Box>
                <Link to="/home">
                    <IconButton
                        alignSelf="flex-end"
                        margin="2rem"
                        aria-label={`go back`}
                        colorScheme="teal"
                        icon={<ArrowBackIcon h={8} w={10} />}
                    />
                </Link>
            </Box>
            <Center>
                <Box
                    w="70vw"
                    h="30vh"
                    bg="white"
                    borderWidth="3px"
                    borderStyle="dashed"
                    borderRadius="lg"
                    {...getRootProps({ className: "dropzone" })}
                >
                    {/* @ts-ignore */}
                    <Input {...getInputProps()} />
                    <Center h="30vh">
                        <Text>Drag 'n' drop or touch to add files</Text>
                    </Center>
                </Box>
            </Center>
            <Container key={1} mt={10}>
                <List spacing={4}>{thumbs}</List>
                <Center m={10}>
                    {files && (
                        <Button
                            colorScheme="teal"
                            size="lg"
                            isLoading={loading}
                            loadingText="Encrypting..."
                            spinnerPlacement="end"
                            onClick={() => {
                                files.map(async (file: FileWithPreview) => {
                                    await encrypt(file);
                                });
                                // setLoading(false);
                            }}
                        >
                            Encrypt
                        </Button>
                    )}
                </Center>
            </Container>
        </Box>
    );
};

export default FileDropzone;
