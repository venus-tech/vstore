<template>
  <v-card flat>
    <AddPayment 
      :show="showAddPayment"
      :orderId="Number(id)"
      @canceled="showAddPayment = false"
      @inserted="insertPayment"
    />
    <Payment 
      :show="showPaymentDialog"
      :payment="showedPayment"
      @canceled="showPaymentDialog = false"
      @removed="remove"
    />
    <v-card-title>
      <v-row>
        <v-col md="5">
          <v-btn x-large color="primary" @click="showAddPayment = true">
            <v-icon left>mdi-plus</v-icon>
            <span>إضافة عملية</span>
          </v-btn>
          <span class="mx-3"></span>
          <v-btn x-large color="info" route :to='`/print/orders/${id}/payements`' >
            <v-icon left>mdi-printer</v-icon>
            <span>طباعة</span>
          </v-btn>
        </v-col>
        <v-col >
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة عمليات الدفع" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title> 
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="payments"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.id="{item}">
          <v-btn color="primary" text @click="showedPayment = item;showPaymentDialog = true">
            <v-icon left>mdi-eye</v-icon>
            <span>{{item.id}}</span>
          </v-btn>
        </template>
        <template v-slot:item.amount="{item}">
          <strong class="green--text" >
            {{ item.amount }} ج
          </strong>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db'

import AddPayment from './AddPayment';
import Payment from './Payment';

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  components:{AddPayment, Payment},
  data: ()=>({
    showAddPayment: false,
    search: '',
    showPaymentDialog: false,
    showedPayment: {},
    loading: true,
    payments: [],
    headers: [
      {
        text: "العملية",
        value: "id"
      },
      {
        text: "التاريخ",
        value: "date",
        align: "center"
      },
      {
        text: "المبلغ",
        value: "amount",
        align: 'left'
      }
    ]
  }),
  async created(){
    await this.loadPayments();
  },
  methods: {
    async loadPayments(){
      this.loading = true;
      const DB = await db.getConnection();

      this.payments = await DB.all(`SELECT * FROM order_payment WHERE order_id = :id`, {
        ":id": this.id
      });

      this.loading = false;
    },
    insertPayment(payment){
      this.payments.unshift(payment);
      this.showAddPayment = false;
    },
    remove(payment){
      this.payments.splice(this.payments.indexOf(payment), 1);
      this.showPaymentDialog = false;
    }
  }
}
</script>

<style>

</style>