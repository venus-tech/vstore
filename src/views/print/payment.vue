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
      شركة أولاد عثمان
    </h2>
    <br>
    <h3 style="text-align:center">
      بيانات ايصال دفع لطلبية
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
    <h2 style="text-align: center">بيانات الايصال</h2>
    <br>
    <table cellspacing="0" border="1" width="100%">
      <tr>
        <td class="pa-2"><strong>رقم الايصال</strong> : {{payment.id}}  </td>
        <td class="pa-2" style="text-align: center"><strong>التاريخ</strong> : {{payment.date}}  </td>
        <td style="text-align: left" class="pa-2"><strong>المبلغ : {{payment.amount}}  جنيه</strong></td>
      </tr>
      <tr>
        <td colspan="3" class="pa-2"><strong>اضافات </strong> : {{payment.note}}  </td>
      </tr>
    </table>
    <br><br>
    <div class="pa-4 headline">التوقيع والختم </div>
    <br><br>
  </div>
</template>

<script>
import db from '../../db'
export default {
  data() {
    return {
      payment: {},
      order: {},
      agency: {},
      employee: {}
    };
  },
  async created(){
    await this.loadOrder_and_Payment();
  },
  methods: {
    async loadOrder_and_Payment(){
      const DB = await db.getConnection();

      this.payment = await DB.get(`SELECT * FROM order_payment WHERE id = :id`, {
        ":id": this.$route.params.id
      });

      this.order = await DB.get(`SELECT * FROM orders WHERE id = :id`, {
        ":id": this.payment.order_id
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