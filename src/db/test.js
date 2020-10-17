/*import { remote } from 'electron' ;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(remote.app.getAppPath() , '..' , 'public' , 'databases' , 'Chinook_Sqlite.sqlite')

const db = new sqlite3.Database(dbPath);

console.log('connected using sqlite3 from ' , dbPath )

export default db ;*/


/* global __static */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const isBuild = process.env.NODE_ENV === 'production'
const dbPath =path.join(
isBuild ? __dirname : __static,
'databases/Chinook_Sqlite.sqlite',
);

const db = new sqlite3.Database(dbPath , (err)=>{
    if(err) {
        console.error(err)
    }
    console.log('connected using sqlite3 from ' , dbPath )
});


export default db ;
