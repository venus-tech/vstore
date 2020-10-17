<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col md="6">
          <strong>
            المبيعات
          </strong>
        </v-col>
        <v-col md="6">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الطلبيات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="selles" :search="search" :loading='loading'>
        <template v-slot:item.id="{item}">
          <v-btn text router :to="`/orders/${item.id}`" color="primary">{{ item.id }}</v-btn>
        </template>
        <template v-slot:item.agency="{item}">
          <v-btn text router :to="`/agents/${item.agency_id}`" color="primary">{{ item.agency }}</v-btn>
        </template>
        <template v-slot:item.employee="{item}">
          <v-btn text router :to="`/employees/${item.employee_id}`" color="primary">{{ item.employee }}</v-btn>
        </template>
        <template v-slot:item.total_bill="{item}">
          <strong >
            {{ item.total_bill }} ج
          </strong>
        </template>
        <template v-slot:item.discount="{item}">
          <strong>
            {{ item.discount }} ج
          </strong>
        </template>
        <template v-slot:item.amount="{item}">
          <strong class="green--text">
            {{ item.amount }} ج
          </strong>
        </template>
        <template v-slot:item.payed="{item}">
          <strong>
            {{ item.payed }} ج
          </strong>
        </template>
        <template v-slot:item.debt="{item}">
          <strong :class="{'red--text':item.debt > 0}">
            {{ item.debt }} ج
          </strong>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db'

export default {
  props: {
    id : {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      search: "",
      headers: [
        {
          text: "الطلبية",
          value: "id"
        },
        {
          text: "التاريخ",
          value: "date"
        },
        {
          text: "المتجر",
          value: "agency"
        },
        {
          text: "القيمة",
          value: "total_bill"
        },
        {
          text: "التخفيض",
          value: "discount"
        },
        {
          text: "المطلوب",
          value: "amount",
          align: "left"
        },
        {
          text: "المدفوع",
          value: "payed",
          align: "left"
        },
        {
          text: "المتبقي",
          value: "debt",
          align: "left"
        }
      ],
      selles: []
    };
  },
  async created(){
    await this.loadSells();
  },
  methods: {
    async loadSells(){
      this.loading = true;
      const DB = await db.getConnection();

      const sql = `
        SELECT 
          orders.id as id,
          orders.date as date,
          agency_id,
          total_bill,
          discount,
          agent_name,
          employee_id,
          agencies.name as agency,
          employees.name as employee,
          (total_bill - discount) as amount,
          (total_bill - discount - payed) as debt,
          payed
        FROM orders
        join agencies 
        join employees
        WHERE 
          orders.type = 'تصدير'
          and
          orders.agency_id = agencies.id
          and
          orders.employee_id = employees.id
          and
          employees.id = :id
      `;

      this.selles = await DB.all(sql,{
        ":id": this.id
      });
      this.loading = false;
    }
  }
};

</script>

<style>
</style>