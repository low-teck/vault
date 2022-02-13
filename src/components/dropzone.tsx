import React, { ReactNode, useEffect, useState } from "react";
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
    useColorModeValue,
    ListItemProps,
    ListIcon,
    Tooltip,
} from "@chakra-ui/react";
import {
    ArrowBackIcon,
    ArrowForwardIcon,
    SmallCloseIcon,
} from "@chakra-ui/icons";
import { FileWithPath, useDropzone } from "react-dropzone";
import CryptoJS from "crypto-js";
import { motion, usePresence } from "framer-motion";
const { ipcRenderer } = window.require("electron");

interface FileWithPreview extends File {
    preview: string;
}
const variants = {
    open: {
        opacity: 1,
        x: 0,
        transition: {
            x: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        opacity: 0,
        x: "-1rem",
        transition: {
            x: { stiffness: 1000 },
        },
    },
};

const MotionEncListItem = ({
    children,
    toggle,
}: {
    children: ReactNode;
    toggle: (value: boolean) => void;
}) => {
    const [isPresent, safeToRemove] = usePresence();
    const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
    const animations = {
        layout: true,
        initial: "out",
        style: {
            position: isPresent ? "static" : "absolute",
        },
        // whileTap: "tapped",
        animate: isPresent ? "in" : "out",
        variants: {
            in: { opacity: 1 },
            out: { opacity: 0 },
            tapped: {
                scale: 0.99,
                opacity: 0.75,
                transition: { duration: 0.25 },
            },
        },
        // @ts-ignore
        onAnimationComplete: () => !isPresent && safeToRemove(),
        transition,
    };
    const listBg = useColorModeValue("#FAFAFA", "gray.700");
    return (
        //@ts-ignore
        <MotionListItem
            {...animations}
            bg={listBg}
            w="50vw"
            onMouseEnter={() => {
                toggle(true);
            }}
            whileHover={{
                scale: 0.98,
            }}
            whileTap={{
                scale: 0.96,
            }}
            onMouseLeave={() => {
                toggle(false);
            }}
            alignSelf="center"
            display="flex"
            minH="10vh"
            borderRadius="md"
            onClick={() => {
                toggle(false);
            }}
        >
            {children}
        </MotionListItem>
    );
};

const MotionBox = motion(Box);
const MotionListItem = motion<ListItemProps>(ListItem);
const MotionListIcon = motion(ListIcon);

const EncListItem = ({
    file,
    handleFilter,
}: {
    file: FileWithPath;
    handleFilter: (file: FileWithPath) => void;
}) => {
    const [on, toggle] = useState(false);
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
    return (
        file && (
            <MotionEncListItem toggle={toggle}>
                <Tooltip
                    label={file ? convertBytes(file.size) : 0}
                    placement="right"
                >
                    <HStack
                        marginX="1rem"
                        spacing={5}
                        justify="space-between"
                        w="50vw"
                    >
                        <HStack maxW="40vw">
                            <MotionListIcon
                                initial="closed"
                                animate={on ? "open" : "closed"}
                                variants={variants}
                                as={ArrowForwardIcon}
                                color="green.500"
                            />
                            <Container maxW="100%">
                                <Text>{file.name}</Text>
                            </Container>
                        </HStack>
                        <HStack>
                            <IconButton
                                aria-label="del"
                                colorScheme="red"
                                variant="ghost"
                                icon={<SmallCloseIcon />}
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                    e.preventDefault();
                                    handleFilter(file);
                                }}
                            />
                        </HStack>
                    </HStack>
                </Tooltip>
            </MotionEncListItem>
        )
    );
};

const FileDropzone = () => {
    const n = 5;
    const [files, setFiles] = useState<Array<FileWithPreview>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: Array<File>) => {
            let newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setFiles([...files, ...newFiles]);
        },
    });

    const handleFilter = (file: FileWithPath) => {
        setFiles(files.filter((f) => f !== file));
    };

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
        files.map((file, index) => (
            <EncListItem handleFilter={handleFilter} key={index} file={file} />
        ));

    const encrypt = async (
        input: FileWithPath
    ): Promise<{ filename: string; result: string }> => {
        setLoading(true);
        var file = input;
        var reader = new FileReader();
        let result;
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                reader.onerror = () => {
                    reader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                let key = await ipcRenderer.invoke("GET_KEY");
                // @ts-ignore
                var wordArray = CryptoJS.lib.WordArray.create(reader.result); // Convert: ArrayBuffer -> WordArray
                var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

                result = await ipcRenderer.invoke("ENC_FILE", {
                    file: encrypted,
                    filename: file.name, //@ts-ignore
                    lastModifiedDate: file.lastModifiedDate,
                    path: file.path,
                    type: file.type.split("/")[1],
                    saved: false,
                });
                resolve({ filename: file.name, result });
                setLoading(false);
            };
            reader.readAsArrayBuffer(file);
        });
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
                                loadingText="encrypting..."
                                spinnerPlacement="end"
                                isDisabled={files.length === 0}
                                onClick={async () => {
                                    const res = await Promise.all(
                                        files.map((file: FileWithPath) => {
                                            return encrypt(file);
                                        })
                                    );

                                    let done: string[] = [],
                                        fail: string[] = [];
                                    console.log(res);
                                    res.forEach((r) => {
                                        r.result === "DONE"
                                            ? done.push(r.filename)
                                            : fail.push(r.filename);
                                    });
                                    let total_count = res.length,
                                        done_count = done.length,
                                        fail_count = fail.length;
                                    if (total_count > n) {
                                        if (fail_count === 0) {
                                            toast({
                                                title: `saved all files, you can now delete the original files :)`,
                                                isClosable: true,
                                                duration: 2000,
                                                variant: "left-accent",
                                                position: "top-right",
                                                status: "success",
                                            });
                                        } else if (fail_count !== total_count) {
                                            toast({
                                                title: `some files already exist in the vault, encrypted the rest :)`,
                                                isClosable: true,
                                                duration: 2000,
                                                variant: "left-accent",
                                                position: "top-right",
                                                status: "warning",
                                            });
                                        } else {
                                            toast({
                                                title: `all files already exist in the vault :(`,
                                                isClosable: true,
                                                duration: 2000,
                                                variant: "left-accent",
                                                position: "top-right",
                                                status: "error",
                                            });
                                        }
                                    } else {
                                        done.map((filename) => {
                                            toast({
                                                title: `saved ${filename}, you can delete it now  :)`,
                                                isClosable: true,
                                                duration: 2000,
                                                variant: "left-accent",
                                                position: "top-right",
                                                status: "success",
                                            });
                                        });
                                        fail.map((filename) => {
                                            toast({
                                                title: `${filename} already exists in the vault :(`,
                                                isClosable: true,
                                                duration: 2000,
                                                variant: "left-accent",
                                                position: "top-right",
                                                status: "error",
                                            });
                                        });
                                    }
                                    setFiles([]);
                                }}
                            >
                                encrypt
                            </Button>
                        )}
                    </Center>
                </VStack>
            </Center>
        </Box>
    );
};

export default FileDropzone;
