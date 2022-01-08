const db = require('./db');

const createCredentials = async (label) => {
	const info = await db.creds.insert({ label });
	return info;
};
const getCredentials = async () => {
	const proxies = await db.creds.find({});
	return { proxies };
};

module.exports = {
	createCredentials,
	getCredentials
};
