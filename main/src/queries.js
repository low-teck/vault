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
    const file = await db.data.findOne({ "file.filename": filename });
    return file;
};

const getAllFileNames = async () => {
    let files = await db.data.find({});
    const fileNames = files ? files.map((file) => file.file.filename) : [];
    return fileNames;
};

const deleteFiles = async (filename) => {
    const res = await db.data.remove(
        { "file.filename": filename },
        { multi: true }
    );
    return res;
};

const deleteAllFiles = async () => {
    const res = await db.data.remove({}, { multi: true });
    return res;
};

module.exports = {
    createCredentials,
    getCredentials,
    saveFile,
    getFile,
    getAllFileNames,
    deleteAllFiles,
    deleteFiles,
};
