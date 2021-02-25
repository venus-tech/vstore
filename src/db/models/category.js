import Conn from '../index'

export default {
  db:null ,

  async init(){
    this.db = await Conn.getConnection() 
  },

  async getCategories(){
    return await this.db.all('select * from categories I  ')
  },

  async addCategory(name , description = null){
    
  }
}