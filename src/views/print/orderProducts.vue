<template>
  <div class="print-zone pa-4">
    <v-card flat class="print-page-options" :loading="loading" loader-height="100">
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
    <h3 style="text-align:center">
      بيانات منتجات طلبية
    </h3>
    <br><br>
    <table cellspacing="0" border="1" width="100%">
      <tr>
        <td width="50%" class="pa-2"><strong>نوع الطلبية</strong> : {{order.type}}  </td>
        <td style="text-align: left" class="pa-2"><strong>رقم الطلبية</strong> : {{order.id}}  </td>
      </tr>
      <tr>
        <td width="50%" class="pa-2"><strong>المتجر </strong> : {{agency.name}}  </td>
        <td style="text-align: left" class="pa-2"><strong>التاريخ </strong> : {{order.date}}  </td>
      </tr>
    </table>
    <br>
    <h2 style="text-align: center">المنتجات</h2>
    <br>
    <table cellspacing="0" border="1" width="100%">
      <thead style="background-color: #CCC">
        <th class="pa-2">#</th>
        <th class="pa-2">المنتج</th>
        <th class="pa-2">الكمية</th>
        <th class="pa-2">سعر الوحدة</th>
        <th class="pa-2" style="text-align:left">السعر الكلي</th>
      </thead>
      <tbody>
        <tr v-for="(product, index) of products" :key="product.id">
          <td class="pa-2">{{index+1}}</td>
          <td class="pa-3">{{product.name}}</td>
          <td class="pa-3">{{product.quantity}} {{product.unit}}</td>
          <td class="pa-3"><strong>{{product.price}} جنيه</strong></td>
          <td class="pa-3" style="text-align:left"><strong>{{product.price * product.quantity}} جنيه</strong></td>
        </tr>
      </tbody>
    </table>
    <br><br>
    <div class="pa-4 headline">التوقيع والختم </div>  
    <br><br>
  </div>
</template>

<script>
import db from '../../db'
export default {
  data : ()=>({
    loading: true,
    products:[],
    order: {},
    agency: {},
    employee: {},
    CompanyInformations: {}
  }),
  async created(){
    this.CompanyInformations = JSON.parse(window.localStorage.getItem('companyInformations'));
    this.loading = true;
    await this.loadOrder();
    await this.loadProucts();
    this.loading = false;
  },
  methods: {
    async loadProucts(){
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

    },
    async loadOrder(){
      const DB = await db.getConnection();
      this.order = await DB.get(`SELECT * FROM orders WHERE id = :id`, {
        ":id": this.$route.params.id
      });

      this.agency = await DB.get(`SELECT * FROM agencies WHERE id = :id`, {
        ":id": this.order.agency_id
      });

      this.employee = await DB.get(`SELECT * FROM employees WHERE id = :id`, {
        ":id": this.order.employee_id
      });
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