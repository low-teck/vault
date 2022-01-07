import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const { ipcRenderer } = window.require('electron');

const validationSchema = Yup.object({
	password: Yup.string()
		.required('Password is required to access the vault')
		.min(6, 'Password should be atleast 6 characters in length'),
	confirmPassword: Yup.string()
		.required('Confirm the password entered above')
		.min(6)
		.oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Signup = () => {
	const [loading, setLoading] = useState(false);
	const formik = useFormik({
		initialValues: {
			password: '',
			confirmPassword: ''
		},
		validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			ipcRenderer.sendSync('signup', { password: 'tanmay' });
			setLoading(false);
			formik.resetForm();
		}
	});
	useEffect(() => {}, []);
	// const signInUser = (e) => {
	// 	e.preventDefault();
	// 	const username = e.target.username.value;
	// 	const password = e.target.password.value;
	// 	console.log(username, password);

	// 	let doc = {
	// 		username,
	// 		dateAdded: String(
	// 			new Date().getDate() +
	// 				"/" +
	// 				(new Date().getMonth() + 1) +
	// 				"/" +
	// 				new Date().getFullYear()
	// 		),
	// 	};
	// 	// db.insert(doc, (err, newDoc) => {
	// 	if (!err) {
	// 		console.info("Item Added");
	// 	}
	// });

	// db.find({ username }, function (err, docs) {
	// 	if (!err) {
	// 		console.log("found this : ", docs);
	// 	}
	// });
	return (
		<>
			<div>
				<p>Tanmay</p>
			</div>
		</>
	);
};

export default Signup;
