const db = require("./db");

const createCredentials = async (label) => {
    const res = await db.creds.insert({ label });
    return res;
};
const getCredentials = async () => {
    const proxies = await db.creds.find({});
    return { proxies };
};

const saveFile = async (file) => {
    const res = await db.data.insert({ file });
    return res;
};

const getFile = async (filename) => {
    const file = await db.data.findOne({ filename });
    return file;
};

const getAllFiles = async () => {
    const files = await db.data.find({});
    if (files.length === 0) {
        return null;
    }
    return files;
};

module.exports = {
    createCredentials,
    getCredentials,
    saveFile,
    getFile,
    getAllFiles,
};
