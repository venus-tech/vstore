// /* global __static */

// const path = require('path');

// const isBuild = process.env.NODE_ENV === 'production'
// const dbPath =path.join(
// isBuild ? __dirname : __static,
// 'databases/vstore.sqlite3',
// );
dbPath = "./public/databases/vstore.sqlite3" ;

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: false
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: false
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: false
  }

};
