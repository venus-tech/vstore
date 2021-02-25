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
      بيانات طلبية
    </h3>
    <br><br>
    <table cellspacing="0" border="1" width="100%">
      <tr>
        <td width="30%"><h3 class="pa-2">رقم الطلبية</h3> </td>
        <td class="pa-3"> {{order.id}} </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">نوع الطلبية</h3> </td>
        <td class="pa-3"> {{order.type}} </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">التاريخ الطلبية</h3> </td>
        <td class="pa-3"> {{order.date}} </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">المتجر </h3> </td>
        <td class="pa-3"> {{agency.name}} </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">العميل</h3> </td>
        <td class="pa-3"> {{order.agent_name}} </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">المبلغ الكلي </h3> </td>
        <td class="pa-3"> <strong>{{order.total_bill}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2"> التخفيض </h3> </td>
        <td class="pa-3"> <strong>{{order.discount}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">المبلغ المطلوب</h3> </td>
        <td class="pa-3"> <strong>{{Number(order.total_bill) - Number(order.discount)}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">المبلغ المدفوع</h3> </td>
        <td class="pa-3"> <strong>{{order.payed}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2">المبلغ المتبقي</h3> </td>
        <td class="pa-3"> <strong>{{Number(order.total_bill) - Number(order.discount) - Number(order.payed)}} جنيه</strong> </td>
      </tr>
      <tr>
        <td width="30%"><h3 class="pa-2"> بيانات اضافية</h3> </td>
        <td class="pa-3"> {{order.notes}} </td>
      </tr>
    </table>
    <br><br>
    <div class="pa-4 headline">التوقيع والختم </div>  
    <br><br>
  </div>
</template>

<script>
import db from '../../db';

export default {
  data() {
    return {
      order: {},
      agency: {},
      employee: {},
      CompanyInformations: {},
    };
  },
  async created(){
    this.CompanyInformations = JSON.parse(window.localStorage.getItem('companyInformations'));
    await this.loadOrder();
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