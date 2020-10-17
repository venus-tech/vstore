<template>
  <v-dialog v-model="show" scrollable persistent max-width="960px" transition="dialog-transition">
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-tag-plus</v-icon>
        <span>إضافة صنف جديد</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field :error-messages="nameErrors" v-model="name" counter="127" label="الإسم" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              outlined
              v-model="description"
              label="وصف عن التصنيف"
              auto-grow
              :error-messages="descriptionErrors"
              rows="3"
              counter="65000"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="addCategory">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '../../db'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      name: '' ,
      description: '' ,
      nameErrors: [],
      descriptionErrors: [],
      errors: []
    };
  },
  methods: {
    async addCategory(){
      const name = this.name.trim().toLowerCase();
      const description = this.description.trim().toLowerCase();

      this.nameErrors = [] ;
      this.descriptionErrors = [] ;
      
      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from categories where name = :name " , {
        ":name": name
      });
      
      if (isUnique.isUnique !== 1) {
        this.nameErrors.push('هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد');
        return false;
      }
      const response = await DB.run("INSERT INTO categories('name' , 'description') VALUES (:name , :description )" , {
        ':name' : name ,
        ':description': description
      }) ;
      const newRow = {
        id: response.lastID ,
        name: name ,
        description: description
      };
      this.$emit('inserted' , newRow );
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
  }
};
</script>

<style>
</style>