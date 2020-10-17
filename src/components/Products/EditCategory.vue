<template>
  <v-dialog v-model="show" scrollable persistent max-width="960px" transition="dialog-transition">
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-pencil</v-icon>
        <span> تعديل الصنف {{ `# ${category.id}` }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field v-model="category.name" :error-messages="nameErrors" counter="127" label="الإسم" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              outlined
              v-model="category.description"
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
        <v-btn x-large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn x-large color="success" @click="editCategory">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ التعديلات</span>
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
    },
    category: {
      type: Object ,
      default: ()=>({})
    }
  },
  data(){
    return {
      nameErrors: [],
      descriptionErrors: [],
      errors: []
    };
  },
  methods: {
    async editCategory(){
      const name = this.category.name.trim().toLowerCase();
      const description = this.category.description.trim().toLowerCase();

      this.nameErrors = [] ;
      this.descriptionErrors = [] ;
      
      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from categories where name = :name and id != :id " , {
        ":name": name ,
        ":id": this.category.id
      });
      
      if (isUnique.isUnique !== 1) {
        this.nameErrors.push('هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد');
        return false;
      }
      await DB.run("UPDATE categories SET name = :name , description = :description WHERE id = :id" , {
        ':name' : name ,
        ':description': description,
        ':id': this.category.id
      }) ;
      const newRow = {
        name: name ,
        description: description
      };
      this.$emit('updated' , newRow );
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
  }
};
</script>

<style>

</style>