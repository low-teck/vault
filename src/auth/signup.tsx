import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Center, Stack, Text, useToast } from "@chakra-ui/react";
import { FormItem, MotionButton } from "../formHelpers";
import { Link, useNavigate } from "react-router-dom";

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
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const toast = useToast();
	const formik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			const val = await ipcRenderer.invoke("SIGN_UP", {
				password: values.password,
			});
			console.log(val);
			if (val === "SUCCESS") {
				toast({
					title: "password set!",
					isClosable: true,
					variant: "left-accent",
					status: "success",
				});
				navigate("/login");
			}
			setLoading(false);
			formik.resetForm();
		},
	});
	useEffect(() => {}, []);
	return (
		<Box>
			<Center h="100vh">
				<form onSubmit={formik.handleSubmit}>
					<Stack spacing={[5, 10, 30]} w={[300, 350, 350]}>
						<Center>
							<Text
								fontSize={{
									base: "24px",
									md: "40px",
									lg: "50px",
								}}
								fontWeight="bold"
								fontFamily="Comfortaa"
							>
								Signup
							</Text>
						</Center>
					</Stack>
					<FormItem
						label="Password"
						value={formik.values.password}
						touched={formik.touched.password}
						onChange={formik.handleChange("password")}
						placeholder="Enter your password..."
						error={formik.errors.password}
					/>
					<FormItem
						label="Confirm Password"
						value={formik.values.confirmPassword}
						touched={formik.touched.confirmPassword}
						onChange={formik.handleChange("confirmPassword")}
						placeholder="Confirm your password..."
						error={formik.errors.confirmPassword}
					/>
					<MotionButton
						colorScheme="cyan"
						loading={loading}
						type="submit"
						label="Sign Up"
					/>
				</form>
			</Center>
		</Box>
	);
};

export default Signup;
