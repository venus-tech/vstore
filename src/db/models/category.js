import Conn from '../index'

export default {
  db:null ,

  async init(){
    console.log('initializing categories model')
    this.db = await Conn.getConnection() 
  },

  async getCategories(){
    console.log('loading categories data')
    return await this.db.all('select * from categories I  ')
  },

  async addCategory(name , description = null){
    
  }
}