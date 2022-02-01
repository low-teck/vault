import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Center, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { FormItem, MotionButton } from "../formHelpers";
import { useNavigate } from "react-router-dom";
import Strength from "../strength";

const { ipcRenderer } = window.require("electron");

const validationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required to access the vault")
        .min(6, "Password should be atleast 6 characters in length"),
    confirmPassword: Yup.string()
        .required("Confirm the password entered above")
        .min(6)
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Signup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [strength, setStrength] = useState<number>(0);
    const navigate = useNavigate();
    const toast = useToast();
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: (values) => {
            setStrength(values.password.length * 8);
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const val = await ipcRenderer.invoke("SIGN_UP", {
                password: values.password,
            });
            const key = await ipcRenderer.invoke("IS_KEY");
            console.log(val);
            if (val === "SUCCESS") {
                toast({
                    title: "password set!",
                    isClosable: true,
                    variant: "left-accent",
                    status: "success",
                });
                if (key) navigate("/login");
                else navigate("/key");
            }
            setLoading(false);
            formik.resetForm();
        },
    });
    return (
        <Box>
            <Center h="100vh">
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={[5, 10, 40]} w={[300, 350, 350]}>
                        <Center>
                            <Heading size="3xl">sign up</Heading>
                        </Center>
                    </Stack>
                    <FormItem
                        label="Password"
                        value={formik.values.password}
                        touched={formik.touched.password}
                        onChange={formik.handleChange("password")}
                        placeholder="enter your password..."
                        error={formik.errors.password}
                    />
                    <br />
                    <FormItem
                        label="Confirm password"
                        value={formik.values.confirmPassword}
                        touched={formik.touched.confirmPassword}
                        onChange={formik.handleChange("confirmPassword")}
                        placeholder="confirm your password..."
                        error={formik.errors.confirmPassword}
                    />
                    <br />
                    <Strength value={strength} />
                    <MotionButton
                        colorScheme="cyan"
                        loading={loading}
                        type="submit"
                        label="sign up"
                    />
                </form>
            </Center>
        </Box>
    );
};

export default Signup;
