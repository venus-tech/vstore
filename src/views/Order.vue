<template>
  <v-card>
    <ConfirmDeletion 
      :show="showCancelDialog"
      @canceled="showCancelDialog = false"
      title="هل فعلا تريد الغاء الطلبية"
      text="يترتب على هذا الاجراء حذف جميع بيانات العملية مما يعني الغاء طلب المنتجات واعادتها الى المخزن مرة اخرى"
    />

    <ConfirmDeletion 
      :show="showRemoveDialog"
      @canceled="showRemoveDialog = false"
      @confirmed="removeOrder"
      title="حذف الطلبية"
      text="ستزال بيانات الطلبية دون ارجاع المنتجات الى المخزن"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات الطلبية
      </v-tab>

      <v-tab href="#products">
        <v-icon right>mdi-barcode-scan</v-icon> المنتجات
      </v-tab>

      <v-tab href="#payments" v-if="order.type == 'تصدير'">
        <v-icon right>mdi-account-cash-outline</v-icon> عمليات الدفع
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="data">
        <v-card flat>
          <v-card-title >
            # {{order.id}} 
            {{order.type}}
            <v-spacer></v-spacer>
            {{order.date}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            <v-btn color="primary" text x-large router :to="`/agents/${agency.id}`">
              {{agency.name}}
            </v-btn>
            <v-spacer></v-spacer>
            {{order.agent_name}}
          </v-card-title>
          <v-divider></v-divider>
           <v-card-title>
            المبلغ الكلي : {{order.total_bill}} ج
            <v-spacer></v-spacer>
            التخفيض: {{order.discount}} ج
            <v-spacer></v-spacer>
            المطلوب : {{Number(order.total_bill) - Number(order.discount)}} ج
            <v-spacer></v-spacer>
            المدفوع : {{order.payed}} ج
            <v-spacer></v-spacer>
            المتبقي :  <span :class="{'red--text':Number(order.total_bill) - Number(order.discount) - Number(order.payed) > 0}">
              {{Number(order.total_bill) - Number(order.discount) - Number(order.payed) }} ج
            </span>          
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            <v-btn color="primary" text x-large router :to="`/employees/${employee.id}`">
              {{employee.name}}
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3>اضافات</h3>
            {{order.notes}}
          </v-card-text>
          
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="info" large route :to='`/print/orders/${order.id}`'>
              <v-icon right>mdi-printer</v-icon>
              <span>طباعة</span>
            </v-btn>
            <!--
            <v-btn color="error" x-large @click="showCancelDialog = true">
              <v-icon left>mdi-cancel</v-icon>
              <span>إلغاء الطلبية</span>
            </v-btn>
            <span class="mx-4"></span>
            <v-btn color="error" x-large @click="showRemoveDialog = true">
              <v-icon left>mdi-delete</v-icon>
              <span>حذف الطلبية</span>
            </v-btn>
            -->
          </v-card-actions>
          
        </v-card>
      </v-tab-item>
      <v-tab-item value="products">
        <OrderProducts :id="Number($route.params.id)" />
      </v-tab-item>
      <v-tab-item value="payments">
        <OrderPayments :id="Number($route.params.id)" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import OrderProducts from '../components/Orders/OrderProducts';
import OrderPayments from '../components/Orders/OrderPayments';

import ConfirmDeletion from '../components/ConfirmDeletion';

import db from '../db';

export default {
  components:{OrderProducts, OrderPayments, ConfirmDeletion},
  data() {
    return {
      showCancelDialog: false,
      showRemoveDialog: false,
      tab: null,
      order: {},
      agency: {},
      employee: {}
    };
  },
  async created(){
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
    async removeOrder(){
      //const DB = await db.getConnection();
      //const deleteOrderSQL = `DELETE `;
      //const deleteOrderProductsSQL = `` ;
      //const deleteOrderPaymentsSQL = `` ;
    }
  }
};
</script>

<style>
</style>