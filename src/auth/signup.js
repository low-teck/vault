import React from "react";
import { db } from "../nedb/items";

function Signup() {
	const signInUser = (e) => {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		console.log(username, password);

		let doc = {
			username,
			dateAdded: String(
				new Date().getDate() +
					"/" +
					(new Date().getMonth() + 1) +
					"/" +
					new Date().getFullYear()
			),
		};
		db.insert(doc, (err, newDoc) => {
			if (!err) {
				console.info("Item Added");
			}
		});

		db.find({ username }, function (err, docs) {
			if (!err) {
				console.log("found this : ", docs);
			}
		});
	};

	return (
		<div className="signup">
			<h1>Signup</h1>
			<form onSubmit={signInUser}>
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<button type="submit">Signup</button>
			</form>
		</div>
	);
}

export default Signup;
