<template>
  <v-card flat>
      <AddTransaction 
        :show="showAddTransactionDialog"
        :employee="employee"
        @canceled="showAddTransactionDialog = false"
        @inserted="insertNew"
      />
      <v-card-title >
          <v-btn color="primary" x-large @click="showAddTransactionDialog = true">
              <v-icon left>mdi-plus</v-icon>
              <span>إضافة معاملة مالية</span>
          </v-btn>
      </v-card-title>
      
      <v-card-title>
      <v-row>
        <v-col>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المعاملات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="transactions" :search="search">
        <template v-slot:item.id="{item}">
          <v-btn color="primary" text route :to="`/transactions/${item.id}`">
            {{item.id}}
          </v-btn>
        </template>
        <template v-slot:item.amount="{item}">
          {{ item.amount }} جنيه
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db';
import AddTransaction from '../transactions/AddTransaction';

export default {
    components: {AddTransaction},
    props: {
        employee: {
            type: Object
        }
    },
    data: ()=>({
       showAddTransactionDialog: false,
       transactions: [], 
       headers: [
        {text: "#", value: "id", align: "right"},
        {text: "التاريخ", value: "date"},
        {text: "النوع", value: "type", align: "center"},
        {text: "المبلغ", value: "amount", align: "left"},
       ],
       search:""
    }),
    async created(){
        await this.loadTransactions();
    },
    methods: {
        async loadTransactions(){
            const DB = await db.getConnection();
            this.transactions = await DB.all('SELECT * FROM money_transactions WHERE employee_id = :id ORDER BY id DESC', {
                ":id": this.employee.id
            });
        },
        insertNew(data){
            this.transactions.unshift(data);
            this.showAddTransactionDialog = false;
        }
    }
}
</script>

<style>

</style>