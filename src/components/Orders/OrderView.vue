<template>
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
      المبلغ الكلي : {{order.total_bill}}
      <v-spacer></v-spacer>
      التخفيض: {{order.discount}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title >
      المطلوب : {{Number(order.total_bill) - Number(order.discount)}}
      <v-spacer></v-spacer>
      المدفوع : {{order.payed}}
      <v-spacer></v-spacer>
      المتبقي :
      <strong :class="{'red--text':Number(order.total_bill) - Number(order.discount) - Number(order.payed) > 0}">
        {{Number(order.total_bill) - Number(order.discount) - Number(order.payed) }}
      </strong>
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
  data() {
    return {
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
        ":id": this.id
      });

      this.agency = await DB.get(`SELECT * FROM agencies WHERE id = :id`, {
        ":id": this.order.agency_id
      });

      this.employee = await DB.get(`SELECT * FROM employees WHERE id = :id`, {
        ":id": this.order.employee_id
      });
    }
  }
};
</script>

<style>

</style>