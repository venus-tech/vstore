<template>
  <div class="print-zone pa-4">
    <v-card flat class="print-page-options">
      <v-card-title>
        <v-btn color="info" x-large  rounded @click="print">
          <v-icon left>mdi-printer</v-icon>
          <span>طباعة</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
    <h2 style="text-align:center">
      {{CompanyInformations.name}}
    </h2>
    <br>
    <h2 style="text-align:center">
      كشف منتجات
    </h2>
    <br><br>
    
    <table cellspacing="0" border="1" width="100%" >
      <thead style="background-color: #CCC">
        <th class="pa-2">المنتج</th>
        <th>وحدة البيع</th>
        <th>سعر الوحدة</th>
        <th>التصنيف</th>
        <th width="150px">#</th>
      </thead>
      <tbody>
        <tr v-for="(product, index) of products" :key="index">
          <td style="padding: 10px ; font-weight: bold; font-size: 17px">{{product.name}}</td>
          <td style="padding: 10px ; font-weight: bold; font-size: 17px">{{product.unit}}</td>
          <td style="padding: 10px ; font-weight: bold; font-size: 17px">{{product.price}} جنيه</td>
          <td style="padding: 10px ; font-weight: bold; font-size: 17px">{{product.category}}</td>
          <td style="padding: 10px ; font-weight: bold; font-size: 17px"></td>
        </tr>
      </tbody>
    </table>

    <br><br>
    <h3 class="pa-3">
      ارقام الهاتف الثابت : 
      {{CompanyInformations.phone_numbers.join(', ')}}
      
    </h3>
    <hr>
    <h3 class="pa-3">
      ارقام الهاتف الجوال :
      {{CompanyInformations.mobile_numbers.join(', ')}}
      
    </h3>
    <hr>
    <h3 class="pa-3">
      حسابات واتساب : 
      {{CompanyInformations.whatsapp_accounts.join(', ')}}
      
    </h3>
    <hr>
    <h3 class="pa-3">
      مواقعانا : <br><br>
      <p v-for="(location,index) of CompanyInformations.locations" :key="index">{{location}}</p>      
    </h3>
  </div>
</template>

<script>
import db from '../../db';

export default {
  data: ()=>({
    CompanyInformations: {},
    products: []
  }),
  async created(){
    this.CompanyInformations = JSON.parse(window.localStorage.getItem('companyInformations'));
    await this.loadProducts();
  },
  methods: {
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
        ORDER BY categories.name
      `)
      this.loading = false ;
    },
    goBack(){
      window.history.back();
    },
    print(){
      window.print();
    }
  }
}
</script>

<style>
  @media print {
    .print-page-options {
      display: none;
    }
  }
  .print-zone{
    background-color: white !important;
  }
</style>