<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col >
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="products" :search="search">
        <template v-slot:item.name="{ item }">
          <v-btn router :to="`/products/${item.id}`" text color="primary" >
            {{ item.name }}
          </v-btn>
          
        </template>

        <template v-slot:item.price="{ item }">
            <strong class="green--text">{{ item.price }}ج</strong>
            لكل {{ item.unit }}
        </template>

        <template v-slot:item.in_store_quantity="{ item }">
            <strong :class="{'red--text' : Number(item.in_store_quantity) < 11.0}">
            {{ item.in_store_quantity }} {{ item.unit }}
            </strong>
        </template>

        <template v-slot:item.category="{ item }">
          <v-btn router :to="`/categories/${item.category_id}`" text color="primary" >
            {{ item.category }}
          </v-btn>  
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db'

export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "الإسم",
          value: "name"
        },
        {
          text: "السعر",
          value: "price"
        },
        {
          text: "المتوفر",
          value: "in_store_quantity"
        },
        {
          text: "الصنف",
          align: "left",
          value: "category"
        }
      ],
      products: [ ]
    };
  },
  async created(){
    await this.loadProducts();
  },
  methods:{
    async loadProducts(){
      this.loading = true ;
      const DB = await db.getConnection();
      this.products =  await DB.all(`
        SELECT 
          products.id as id,
          products.name as name,
          unit_price as price,
          unit,
          in_store_quantity,
          category_id,
          categories.name as category	 
        from products 
        join categories 
        where 
          products.category_id = categories.id and products.archived = 0
      `)
      this.loading = false ;
    },
  }
};
</script>

<style>
</style>