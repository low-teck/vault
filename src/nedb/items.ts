import Datastore from "nedb";

export const db = new Datastore({
    filename: "~/Desktop/vaultdb",
    autoload: true,
});
