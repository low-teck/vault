import React from "react";
import { FormItem, MotionButton } from "../formHelpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Center, Heading, Stack } from "@chakra-ui/react";

const validationSchema = Yup.object({
    key: Yup.string().required("personal key adds an extra layer of security"),
});

const SetKeyDialog = () => {
    const formik = useFormik({
        initialValues: {
            key: "",
        },
        validationSchema,
        onSubmit: () => {},
    });

    return (
        <Box w="100vw" h="100vh">
            <Center h="100vh" w="100vw">
                <Stack>
                    <Heading>encryption key</Heading>
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        <FormItem
                            label="encryption key"
                            isRequired={true}
                            value={formik.values.key}
                            touched={formik.touched.key}
                            onChange={formik.handleChange("key")}
                            placeholder="enter a key..."
                            error={formik.errors.key}
                            variant="ghost"
                        />

                        <MotionButton
                            colorScheme="teal"
                            label="submit"
                            type="submit"
                        />
                    </form>
                </Stack>
            </Center>
        </Box>
    );
};

export default SetKeyDialog;
