import Datastore from "nedb";
import path from "path";

export const db = new Datastore({
    filename: "~/Desktop/vaultdb",
    autoload: true,
});
