const { app } = require("electron");
const Datastore = require("nedb-promises");
const dbFactory = (fileName) =>
    Datastore.create({
        filename:
            (process.env.NODE_ENV === "dev"
                ? `${__dirname}/..`
                : process.resourcesPath) + `/data/${fileName}`,
        timestampData: true,
        autoload: true,
    });

const db = {
    creds: dbFactory("credentials.db"),
    data: dbFactory("files.db"),
};
module.exports = db;
