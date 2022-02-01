import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Center, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { MotionButton, SecureFormItem } from "../formHelpers";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const validationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required to access the vault")
        .min(6, "Password should be atleast 6 characters in length"),
});

const Signin = () => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const val = await ipcRenderer.invoke("SIGN_IN", {
                password: values.password,
            });
            console.log(val);
            if (val === "SUCCESS") {
                toast({
                    title: `welcome back :)`,
                    isClosable: true,
                    variant: "left-accent",
                    status: "success",
                });
                navigate("/home");
            } else {
                toast({
                    title: "wrong password, try again",
                    isClosable: true,
                    variant: "left-accent",
                    status: "error",
                });
            }
            setLoading(false);
            formik.resetForm();
        },
    });

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShow(!show);
    };

    return (
        <Box w="100vw" h="100vh">
            <Box position="fixed" right={0} margin={5}></Box>
            <Center h="100vh">
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={[5, 10, 30]} w={[300, 350, 350]}>
                        <Center>
                            <Heading size="3xl">login</Heading>
                        </Center>
                    </Stack>
                    <SecureFormItem
                        label="Password"
                        value={formik.values.password}
                        touched={formik.touched.password}
                        onChange={formik.handleChange("password")}
                        toggle={handleClick}
                        placeholder="Enter your password..."
                        error={formik.errors.password}
                        show={show}
                    />

                    <MotionButton
                        colorScheme="cyan"
                        loading={loading}
                        type="submit"
                        label="Login"
                    />
                </form>
            </Center>
        </Box>
    );
};

export default Signin;
