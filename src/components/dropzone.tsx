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
    HStack,
    VStack,
    useColorMode,
} from "@chakra-ui/react";
import {
    ArrowBackIcon,
    ArrowForwardIcon,
    SmallCloseIcon,
} from "@chakra-ui/icons";
import { FileWithPath, useDropzone } from "react-dropzone";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
const { ipcRenderer } = window.require("electron");

interface FileWithPreview extends File {
    preview: string;
}

const MotionBox = motion(Box);

const FileDropzone = () => {
    const [files, setFiles] = useState<Array<FileWithPreview>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { colorMode } = useColorMode();
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

    useEffect(() => {
        console.log(files);
    }, [files]);

    function convertBytes(bytes: any) {
        if (bytes < 1024) {
            return bytes + " bytes";
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + " KB";
        } else if (bytes < 1073741824) {
            return (bytes / 1048576).toFixed(1) + " MB";
        } else {
            return (bytes / 1073741824).toFixed(1) + " GB";
        }
    }

    const thumbs =
        files &&
        files.map((file: FileWithPath, index: number) => {
            return (
                file && (
                    <ListItem
                        display="flex"
                        w="50vw"
                        alignSelf="center"
                        borderRadius="md"
                        bg={colorMode === "dark" ? "gray.700" : "#FAFAFA"}
                        key={index}
                        minH="10vh"
                    >
                        <HStack marginX="1rem" w="100%" justify="space-between">
                            <HStack>
                                <ArrowForwardIcon color="teal" />
                                <Container maxWidth="50vw">
                                    <Text>{file.name}</Text>
                                </Container>
                            </HStack>
                            <HStack>
                                <Text>{convertBytes(file.size)}</Text>
                                <IconButton
                                    aria-label="del"
                                    colorScheme="red"
                                    variant="ghost"
                                    icon={<SmallCloseIcon />}
                                    onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                        e.preventDefault();
                                        setFiles(
                                            files.filter((f) => f !== file)
                                        );
                                    }}
                                />
                            </HStack>
                        </HStack>
                    </ListItem>
                )
            );
        });

    const encrypt = async (input: FileWithPath) => {
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
                filename: file.name, //@ts-ignore
                lastModifiedDate: file.lastModifiedDate,
                path: file.path,
                type: file.type.split("/")[1],
                saved: false,
            });

            if (result === "DONE") {
                toast({
                    title: `${file.name} saved! you can now delete the original file :)`,
                    isClosable: true,
                    duration: 2000,
                    variant: "left-accent",
                    position: "top-right",
                    status: "success",
                });
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <Box w="100vw" h="100vh" overflowY="scroll" overflowX="hidden">
            <Box position="fixed" margin="4rem" zIndex="sticky">
                <Link to="/home">
                    <IconButton
                        alignSelf="flex-end"
                        aria-label={`go back`}
                        colorScheme="teal"
                        icon={<ArrowBackIcon h={8} w={10} />}
                    />
                </Link>
            </Box>
            <Center paddingTop="4rem">
                <MotionBox
                    width="50vw"
                    height="30vh"
                    borderWidth="3px"
                    whileHover={{
                        borderStyle: "solid",
                        borderRadius: "20px",
                        transition: { duration: 0.1 },
                    }}
                    borderStyle="dashed"
                    borderRadius="lg"
                    {...getRootProps({ className: "dropzone" })}
                >
                    <MotionBox whileTap={{ scale: 0.95 }}>
                        {/* @ts-ignore */}
                        <Input {...getInputProps()} />
                        <Center h="30vh">
                            <Text fontSize="xl">
                                drag 'n' drop or click to add files
                            </Text>
                        </Center>
                    </MotionBox>
                </MotionBox>
            </Center>
            <Center mt={10}>
                <VStack>
                    <List w="50vw" spacing={4}>
                        {thumbs}
                    </List>
                    <Center m={10}>
                        {files && (
                            <Button
                                m="5"
                                colorScheme="teal"
                                size="lg"
                                isLoading={loading}
                                loadingText="Encrypting..."
                                spinnerPlacement="end"
                                isDisabled={files.length === 0}
                                onClick={() => {
                                    files.map(async (file: FileWithPath) => {
                                        await encrypt(file);
                                    });
                                }}
                            >
                                Encrypt
                            </Button>
                        )}
                    </Center>
                </VStack>
            </Center>
        </Box>
    );
};

export default FileDropzone;
