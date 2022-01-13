import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import { SecureFormItem } from "../../../formHelpers";
const { ipcRenderer } = window.require("electron");

const validationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required to access the vault")
        .min(6, "Password should be atleast 6 characters in length"),
    newPassword: Yup.string()
        .required("Password is required to access the vault")
        .min(6, "Password should be atleast 6 characters in length"),
});

const ChangePasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState([false, false]);
    const toast = useToast();
    const formik = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const val = await ipcRenderer.invoke("CHANGE_PASS", {
                password: values.password,
                newPassword: values.newPassword,
            });
            console.log(val);
            if (val === "SUCCESS") {
                toast({
                    title: `changed password`,
                    isClosable: true,
                    variant: "left-accent",
                    status: "success",
                });
            } else {
                toast({
                    title: "shoot, try again",
                    isClosable: true,
                    variant: "left-accent",
                    status: "error",
                });
            }
            setLoading(false);
            formik.resetForm();
        },
    });

    const handlePassClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShow([!show[0], show[1]]);
    };

    const handleNewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShow([show[0], !show[1]]);
    };
    return (
        <Box>
            <form onSubmit={formik.handleSubmit}>
                <Stack alignSelf="flex-start">
                    <SecureFormItem
                        label="password"
                        value={formik.values.password}
                        touched={formik.touched.password}
                        onChange={formik.handleChange("password")}
                        toggle={handlePassClick}
                        placeholder="Enter your password..."
                        error={formik.errors.password}
                        show={show[0]}
                    />
                    <SecureFormItem
                        label="new password"
                        value={formik.values.newPassword}
                        touched={formik.touched.newPassword}
                        onChange={formik.handleChange("newPassword")}
                        toggle={handleNewClick}
                        placeholder="Enter the new password..."
                        error={formik.errors.newPassword}
                        show={show[1]}
                    />
                    <Button type="submit" variant="ghost">
                        change
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default ChangePasswordForm;
