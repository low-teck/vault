const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	win.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "./public/index.html")}`
	);
	ipcMain.on("fauxcmd", (e, a) => {
		console.log("hello");
	});
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
