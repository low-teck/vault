import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Center,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { MotionButton, SecureFormItem } from "../formHelpers";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const validationSchema = Yup.object({
	password: Yup.string()
		.required("Password is required to access the vault")
		.min(6, "Password should be atleast 6 characters in length"),
});

const DeleteAccount = () => {
	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => setIsOpen(false);
	const cancelRef = useRef(null);
	const toast = useToast();
	const navigate = useNavigate();

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		//handle deletion
		// ipcRenderer.invoke("DELETE_ACCOUNT");
		toast({
			title: "account deleted",
			isClosable: true,
			variant: "left-accent",
			status: "info",
		});
		setIsOpen(false);
		navigate("/signup");
	};

	return (
		<>
			<Button
				colorScheme="red"
				variant="ghost"
				onClick={() => setIsOpen(true)}
			>
				delete account
			</Button>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							delete account?
						</AlertDialogHeader>

						<AlertDialogBody>
							are you sure? deleting account will lead to the
							deletion of all the encrypted files and your
							personal key
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								variant="ghost"
								onClick={onClose}
							>
								cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={handleDelete}
								ml={3}
								variant="ghost"
							>
								delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

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
			<Box position="fixed" right={0} margin={5}>
				<DeleteAccount />
			</Box>
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
							>
								Login
							</Text>
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
