import React, { useState } from "react";
import { FormItem, MotionButton } from "../formHelpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, useToast, Center, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const validationSchema = Yup.object({
    key: Yup.string().required("personal key adds an extra layer of security"),
});

const SetKeyDialog = () => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            key: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const val = await ipcRenderer.invoke("SET_KEY", {
                key: values.key,
            });
            if (val === "SUCCESS") {
                toast({
                    title: `welcome back :)`,
                    isClosable: true,
                    variant: "left-accent",
                    status: "success",
                });
                navigate("/home");
                setLoading(false);
            }
            formik.resetForm();
        },
    });

    return (
        <Box w="100vw" h="100vh">
            <Center h="100vh" w="100vw">
                <Stack>
                    <Heading>Encryption key</Heading>
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        <FormItem
                            label="Encryption key"
                            isRequired={true}
                            value={formik.values.key}
                            touched={formik.touched.key}
                            onChange={formik.handleChange("key")}
                            placeholder="enter encryption key"
                            error={formik.errors.key}
                        />

                        <MotionButton
                            colorScheme="teal"
                            label="Submit"
                            type="submit"
                        />
                    </form>
                </Stack>
            </Center>
        </Box>
    );
};

export default SetKeyDialog;
