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
    <h3 style="text-align:center">
      بيانات الدفعيات المالية لطلبية
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
    <br><br>
    <table cellspacing="0" border="1" width="100%">
      <tr>
        <td width="50%" class="pa-2"><strong>المبلغ الكلي : {{order.total_bill}} جنيه</strong>   </td>
        <td style="text-align: left" class="pa-2"><strong>التخفيض : {{order.discount}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="50%" class="pa-2"><strong>المبلغ المطلوب : {{Number(order.total_bill) - Number(order.discount)}} جنيه</strong></td>
        <td style="text-align: left" class="pa-2"><strong>المبلغ المدفوع : {{order.payed}} جنيه</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="pa-2"><strong>المبلغ المتبقي : {{Number(order.total_bill) - Number(order.discount) - Number(order.payed)}} جنيه</strong></td>
      </tr>
    </table>
    <br>
    <h2 style="text-align: center">الدفعيات المالية</h2>
    <br>
    <table border="1" cellspacing="0" width="100%">
      <thead>
        <th class="pa-2">#</th>
        <th class="pa-2">رقم العملية</th>
        <th class="pa-2">التاريخ</th>
        <th class="pa-2" style="text-align: left">الميلغ</th>
      </thead>
      <tbody>
        <tr v-for="(payment, index) of payments" :key="payment.id">
          <td class="pa-2" >{{index+1}}</td>
          <td class="pa-3">{{payment.id}}</td>
          <td class="pa-3">{{payment.date}}</td>
          <td class="pa-3" style="text-align: left">
            <strong>{{payment.amount}} جنيه </strong>
          </td>
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
    payments:[],
    order: {},
    agency: {},
    employee: {},
    CompanyInformations: {},
  }),
  async created(){
    this.CompanyInformations = JSON.parse(window.localStorage.getItem('companyInformations'));
    this.loading = true;
    await this.loadOrder();
    await this.loadPayments();
    this.loading = false;
  },
  methods: {
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
    async loadPayments(){
      this.loading = true;
      const DB = await db.getConnection();

      this.payments = await DB.all(`SELECT * FROM order_payment WHERE order_id = :id`, {
        ":id": this.$route.params.id
      });

      this.loading = false;
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