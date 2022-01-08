// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { createCredentials, getCredentials } = require("./queries");
const keytar = require("keytar");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.loadURL("http://localhost:3000");

	ipcMain.on("fauxcmd", (e, a) => {
		let doc = {
			username: "low-teck",
			dateAdded: String(
				new Date().getDate() +
					"/" +
					(new Date().getMonth() + 1) +
					"/" +
					new Date().getFullYear()
			),
		};
		// createCredentials(doc);
		console.log(
			"All credentials: ",
			getCredentials().then((res) => console.log(res.proxies[3].label))
		);
	});

	ipcMain.handle("SIGN_UP", async (event, args) => {
		await keytar.setPassword("vault", "user", args.password);
		return "DONE";
	});

	ipcMain.handle("SIGN_IN", async (event, args) => {
		const password = await keytar.getPassword("vault", "user");
		if (password === args.password) {
			return "SUCCESS";
		}
		return "FAILED";
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
