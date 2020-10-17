module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true ,
      externals: ["sqlite3"],
      extraResources: [ 'databases/' , '../databases/Chinook_Sqlite.sqlite']
    }
  }
}