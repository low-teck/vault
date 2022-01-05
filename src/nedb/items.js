var Datastore = require('nedb');
export const db = new Datastore({ filename: '~/Desktop/vaultdb', autoload: true });
