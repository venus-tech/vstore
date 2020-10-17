/* global __static */

const path = require('path');

const isBuild = process.env.NODE_ENV === 'production'
const dbPath =path.join(
isBuild ? __dirname : __static,
'databases/Chinook_Sqlite.sqlite',
);

export default dbPath ;