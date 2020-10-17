<template>
  <v-dialog v-model="show" scrollable persistent max-width="960px" transition="dialog-transition">
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-domain-plus</v-icon>
        <span>إضافة متجر جديد</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field v-model="name" :error-messages="nameErrors" counter="127" label="الإسم" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox v-model="phone_numbers" counter="4" label="أرقام الهاتف" multiple small-chips chips outlined ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="address" counter="511" label="العنوان" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="notes" outlined label=" بيانات إضافية عن المتجر " auto-grow rows="3" counter="65000"></v-textarea>
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
        <v-btn large color="success" @click="addAgency">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '../../db' ;

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      name: '',
      notes: '',
      address: '',
      phone_numbers: [],
      nameErrors: [],
    }
  },
  methods: {
    async addAgency(){
      const name = this.name.trim().toLowerCase();
      this.nameErrors = [];

      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from agencies where name = :name " , {
        ":name": name
      });
      
      if (isUnique.isUnique !== 1) {
        this.nameErrors.push('هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد');
        return false;
      }

      const sql = `
        INSERT INTO agencies (name, address, phone_numbers, notes)
        VALUES (:name, :address, :phone_numbers, :notes)
      `;

      const address = this.address.trim();
      const phone_numbers = this.phone_numbers.join(',');
      const notes = this.notes.trim();
      
      const data = {
        ":name": name,
        ":address": address,
        ":phone_numbers": phone_numbers,
        ":notes": notes
      };

      const response = await DB.run(sql, data);
      console.log(response)
      const newProduct = {
        id: response.lastID,
        name: name,
        address: address,
        phone_numbers: phone_numbers,
        notes: notes
      };

      this.$emit('inserted', newProduct);
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    }
  }
};
</script>

<style>
</style>