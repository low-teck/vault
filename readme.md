![www vaultenc live](https://user-images.githubusercontent.com/63122405/155536095-347831e9-29ee-43d9-a486-e7f1dd288b37.png)

# Vault 🔐
A react-electron app that secures user data locally using AES algorithm with the help of [nedb](https://www.npmjs.com/package/nedb-promises) and [crypto-js](https://www.npmjs.com/package/crypto-js) ans styled with [chakra-ui](https://chakra-ui.com/).

You can download app for your platform from [vaultenc.live](https://vaultenc.live)

https://user-images.githubusercontent.com/63122405/155539592-c61cceef-d8b7-43b0-bf74-cb48f2a22279.mov

</br>

## To run this project in development mode on your local machine follow the following steps 

* Clone this project, install dependencies using `yarn install`

* If you get fork-plugin error run `yarn add --dev fork-ts-checker-webpack-plugin`

* To run the renderer, in root directory run `yarn start`

* To start main process of electron run `yarn start-electron`

</br>

## To build this project and make production apps follow the following steps

1. In `public/electron.js` change ```mainWindow.loadURL(
            process.env.ELECTRON_START_URL || "http://localhost:3000"
        );``` with
``` tsx
mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
```

2. Change `dbPath` with `dbProdPath` in `db.js`
```tsx
this.db = Datastore.create({
            filename: dbProdPath,
            timestampData: true,
        });
```

3. Run `yarn electron-pack`
