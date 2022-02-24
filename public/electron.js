const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");
// const isDev = require("electron-is-dev");

const keytar = require("keytar");
const os = require("os");
const log = require("electron-log");

try {
    function createWindow() {
        const mainWindow = new BrowserWindow({
            width: 900,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
                preload: path.join(__dirname, "preload.js"),
            },
            icon: __dirname + "/assets/icon.png",
        });

        const username = os.userInfo().username;

        mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

        ipcMain.handle("SIGN_UP", async (event, args) => {
            await keytar.setPassword("vault", username, args.password);
            return "SUCCESS";
        });

        ipcMain.handle("CHANGE_PASS", async (event, args) => {
            const password = await keytar.getPassword("vault", username);
            if (password !== args.password) return "FAILED";
            else {
                await keytar.setPassword("vault", username, args.newPassword);
                return "SUCCESS";
            }
        });

        ipcMain.handle("SET_KEY", async (event, args) => {
            await keytar.setPassword("vault_enc_key", username, args.key);
            return "SUCCESS";
        });

        ipcMain.handle("GET_KEY", async (event, args) => {
            const key = await keytar.getPassword("vault_enc_key", username);
            return key;
        });

        ipcMain.handle("IS_KEY", async (event, args) => {
            const key = await keytar.getPassword("vault_enc_key", username);
            return key !== null;
        });

        ipcMain.handle("SIGN_IN", async (event, args) => {
            const password = await keytar.getPassword("vault", username);
            if (password === args.password) {
                return "SUCCESS";
            }
            return "FAILED";
        });

        ipcMain.handle("USER_EXISTS", async (event, args) => {
            const password = await keytar.getPassword("vault", username);
            return password ? true : false;
        });

        ipcMain.handle("SAVE_STATE", async (event, args) => {
            await db.updateSaveState(args.name);
            return "SUCCESS";
        });

        ipcMain.handle("DEC_FILE", async (event, args) => {
            const file = await db.getFile(args.name);
            return file;
        });

        ipcMain.handle("DELETE_FILE", async (event, args) => {
            try {
                await db.deleteFiles(args.name);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipcMain.handle("DELETE_ACCOUNT", async (event, args) => {
            try {
                await db.deleteAllFiles();
                await keytar.deletePassword("vault", username);
                await keytar.deletePassword("vault_enc_key", username);
                return true;
            } catch (e) {
                return false;
            }
        });

        ipcMain.handle("ENC_FILE", async (event, args) => {
            const file = {
                ...args,
                date: new Date(),
            };
            const res = await db.saveFile(file);
            return res ? "DONE" : "FAILED";
        });

        ipcMain.handle("GET_DATA", async (event, args) => {
            const files = await db.getAllFileData();
            return files;
        });
    }

    app.whenReady().then(() => {
        createWindow();

        app.on("activate", function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    app.on("window-all-closed", function () {
        if (process.platform !== "darwin") app.quit();
    });
} catch (e) {
    log.error(e);
}
