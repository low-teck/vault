const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const db = require("./db.ts");
const keytar = require("keytar");

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

	ipcMain.on("signup", async (event, args) => {
		await keytar.setPassword("Vault", "admin", args.password);
		const secret = await keytar.getPassword("Vault", "admin");
		console.log(secret);
		event.returnValue = "got it!";
	});

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
		db.store.insert(doc, (err, newDoc) => {
			if (!err) {
				console.info("Item Added");
			}
		});

		db.store.find({ username: "low-teck" }, function (err, docs) {
			if (!err) {
				console.log("found this : ", docs);
			}
		});
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
