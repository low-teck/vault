import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Center, Stack, Text } from '@chakra-ui/react';
import { FormItem, MotionButton } from './formHelpers';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const validationSchema = Yup.object({
	password: Yup.string()
		.required('Password is required to access the vault')
		.min(6, 'Password should be atleast 6 characters in length')
});

const Signin = () => {
	const [loading, setLoading] = useState(false);
	const formik = useFormik({
		initialValues: {
			password: ''
		},
		validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			const val = await ipcRenderer.invoke('SIGN_IN', {
				password: values.password
			});
			console.log(val);
			setLoading(false);
			formik.resetForm();
		}
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
									base: '24px',
									md: '40px',
									lg: '50px'
								}}
								fontWeight="bold"
								fontFamily="Comfortaa"
							>
								Login
							</Text>
						</Center>
					</Stack>
					<FormItem
						label="Password"
						value={formik.values.password}
						touched={formik.touched.password}
						onChange={formik.handleChange('password')}
						placeholder="Enter your password..."
						error={formik.errors.password}
					/>

					<MotionButton colorScheme="cyan" loading={loading} type="submit" label="Login" />
					<Link to="/signup">
						<Text
							style={{ cursor: 'pointer' }}
							as="u"
							fontSize={{
								base: '10px',
								md: '10px',
								lg: '15px'
							}}
						>
							Don't have an account? Signup
						</Text>
					</Link>
				</form>
			</Center>
		</Box>
	);
};

export default Signin;
