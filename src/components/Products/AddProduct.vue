<template>
  <v-dialog v-model="show" scrollable persistent max-width="960px" transition="dialog-transition">
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-plus-box</v-icon>
        <span>إضافة منتج جديد</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field counter="127" label="الإسم" outlined v-model="name" :error-messages="nameErrors"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field counter="127" label="وحدة القياس" outlined v-model="unit" :error-messages="unitErrors"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="price" type="number" :min="0" step="0.01" suffix=" جنيه  " label="سعر بيع الوحدة" outlined></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="buy_price" type="number" :min="0" step="0.01" suffix=" جنيه  " label="بكم اشتريت الوحدة" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="description"
              outlined
              label="وصف عن المنتج"
              auto-grow
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
        <v-btn large color="success" @click="addProduct">
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
    },
    category:{
      type: Number,
      required: true
    }
  },
  data(){
    return {
      name: '',
      unit: '',
      description: '',
      price: 0.0,
      buy_price: 0.0,
      nameErrors: [],
      unitErrors: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async addProduct(){
      const name = this.name.trim().toLowerCase();
      this.nameErrors = [];
      this.unitErrors = [];

      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      const unit = this.unit.trim().toLowerCase();
      if(unit.length < 1 || unit.length > 127){
        this.unitErrors.push('يجب ان تحتوي وحدة القياس على حرف واحد على الاقل وان لا تزيد عن 127 حرف');
        return false ;
      }
      
      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from products where name = :name " , {
        ":name": name
      });
      
      if (isUnique.isUnique !== 1) {
        this.nameErrors.push('هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد');
        return false;
      }

      const sql = `
        INSERT INTO products ('name', 'description', 'category_id', 'unit_price', 'unit', 'buy_price')
        VALUES (:name, :description, :category, :price, :unit, :buy_price)
      `;
      const data = {
        ":name": name,
        ":description": this.description.trim().toLowerCase(),
        ":category": this.category,
        ":price": this.price,
        ":unit": unit,
        ":buy_price": this.buy_price,
      };
      const response = await DB.run(sql, data);

      const newProduct = {
        id: response.lastID,
        name: name,
        unit_price: this.price,
        buy_price: this.buy_price
      };

      this.$emit('inserted', newProduct);
    }
  }
};
</script>

<style>
</style>