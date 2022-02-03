const { app } = require("electron");
const Datastore = require("nedb-promises");

class Database {
    constructor() {
        const dbPath = `${process.cwd()}/data/files.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    saveFile = async (file) => {
        const res = await this.db.insert({ file });
        return res;
    };

    getFile = async (filename) => {
        const file = await this.db.findOne({ "file.filename": filename });
        return file;
    };

    getAllFileData = async () => {
        let files = await this.db.find({});
        let data = [];
        files.forEach((file) => {
            data.push({
                filename: file.file.filename,
                saved: file.file.saved,
                type: file.file.type,
                date: file.file.date,
                path: file.file.path,
                lastModifiedDate: file.file.lastModifiedDate,
            });
        });
        return data;
    };

    deleteFiles = async (filename) => {
        const res = await this.db.remove(
            { "file.filename": filename },
            { multi: true }
        );
        return res;
    };

    deleteAllFiles = async () => {
        const res = await this.db.remove({}, { multi: true });
        return res;
    };

    updateSaveState = async (filename) => {
        const res = await this.db.update(
            { "file.filename": filename },
            { $set: { "file.saved": true } }
        );
        return res;
    };
}

module.exports = new Database();
