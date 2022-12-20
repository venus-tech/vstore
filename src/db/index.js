/* not_global __static */

//import {remote} from 'electron' ;
//
//const dbPath = remote.app.getAppPath();
//
//const dbName = 'store.db' ;
//
//const DBFileName = path.join(dbPath , dbName) ;

const path = require('path');
const sqlite3 = require('sqlite3');
const Database = require('sqlite-async');

sqlite3.verbose();


/*const isBuild = process.env.NODE_ENV === 'production'
const dbPath =path.join(
isBuild ? __dirname : __static,
'databases/store.db',
);*/

const electron = require('electron');

const dbPath = path.join(electron.remote.app.getPath('userData') , 'databases' , 'store.db');

export default {
    /*getDb(){
        let dbConnection = new sqlite3.cached.Database(dbPath , (err)=>{
            if(err){
                console.error(err) ;
            }
            console.log(`cached database connection established , file => ${dbPath}`);
        });
        if(!dbConnection.open){
            console.log('cached db is closed');
            dbConnection = new sqlite3.Database(dbPath, (err)=>{
                if(err){
                    console.error(err)
                }
                console.log(`new database connection established , file => ${dbPath}`);
            })
        }
        console.log('is open' , dbConnection.open);
        return dbConnection ;
    },*/
    async getConnection(){
        try {
            // console.log(dbPath);
            this.DBConnection = await Database.open(dbPath);
            return this.DBConnection ;
        }catch(e){
            console.error(e) ;
        }
    },
    async closeConnection(){
        this.DBConnection.close();
    }
};