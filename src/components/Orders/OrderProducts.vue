<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col cols="3">
          <v-btn color="info" large route :to='`/print/orders/${id}/products`'>
              <v-icon left>mdi-printer</v-icon>
              <span>طباعة</span>
            </v-btn>
        </v-col>
        <v-col>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="products"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.name="{item}">
          <v-btn color="primary" text router :to="`/products/${item.id}`">
            {{ item.name }}
          </v-btn>
        </template>
        <template v-slot:item.quantity="{item}">
          {{ item.quantity }} {{item.unit}}
        </template>
        <template v-slot:item.price="{item}">
          <strong >
            {{ item.price }} ج
          </strong>
        </template>
        <template v-slot:item.total_price="{item}">
          <strong >
            {{ Number(item.price) * Number(item.quantity) }} ج
          </strong>
        </template>
        <template v-slot:item.buy_price="{item}">
          <strong >
            {{ item.buy_price }} ج
          </strong>
        </template>
        <template v-slot:item.profit="{item}">
          <strong class="green--text">
            {{ (Number(item.price) - Number(item.buy_price)) *  Number(item.quantity) }} ج
          </strong>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db';

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data : ()=>({
    search: "",
    loading: true,
    products:[],
    headers: [
      {
        "text": "المنتج",
        "value": "name"
      },
      {
        "text":  "الكمية",
        "value": "quantity"
      },
      {
        "text": "السعر",
        "value": "price"
      },
      {
        "text": "السعر الكلي",
        "value": "total_price"
      },
      {
        "text": "سعر الشراء",
        "value": "buy_price"
      },
      {
        "text": "الربح",
        "value": "profit",
        "align": "left"
      },
      
    ],
  }),
  async created(){
    await this.loadProucts();
  },
  methods: {
    async loadProucts(){
      this.loading = true;
      const DB = await db.getConnection();

      const sql = `
        SELECT order_product.product_id as id,
          products.name as name,
          products.unit as unit,
          order_product.quantity as quantity,
          order_product.price as price,
          0 as total_price,
          order_product.buy_price as buy_price,
          0 as profit
        FROM order_product 
        JOIN products 
        WHERE 
          order_product.product_id = products.id 
          AND 
          order_product.order_id = :id
      `;

      this.products = await DB.all(sql,{":id" : this.$route.params.id});
      this.loading = false;

    }
  }
}
</script>

<style>

</style>