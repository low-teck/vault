const Datastore = require("nedb");

const store = new Datastore({
	filename: "~/Desktop/vaultdb",
	autoload: true,
});

module.exports = { store };
