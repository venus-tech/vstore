<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المعاملات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="transactions" :search="search">
        <template v-slot:item.id="{item}">
          <v-btn color="primary" text route :to="`/transactions/${item.id}`">
            {{item.id}}
          </v-btn>
        </template>
        <template v-slot:item.employee="{item}">
          <v-btn color="primary" text route :to="`/employees/${item.employee_id}`">
            {{item.employee}}
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../db'

export default {
  data(){
    return {
      transactions: [],
      loading: false,
      headers: [
        {text: "#", value: "id"},
        {text: "التاريخ", value: "date"},
        {text: "النوع", value: "type", align: "center"},
        {text: "المبلغ", value: "amount"},
        {text: "الموظف", value: "employee", align: "left"},
      ],
      search:""
    };
  },
  async created(){
    await this.loadTransactions();
  },
  methods: {
    async loadTransactions(){
      const DB = await db.getConnection();
      this.transactions = await DB.all(`
        SELECT 
          money_transactions.id as id,
          money_transactions.date as date,
          money_transactions.amount as amount,
          money_transactions.type as type,
          employees.name as employee ,
          employee_id 
        FROM money_transactions 
        JOIN employees 
        WHERE money_transactions.employee_id = employees.id ORDER BY id DESC
      `);
    }
  }
}
</script>

<style>

</style>