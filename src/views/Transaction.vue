<template>
  <v-card>
    <ConfirmDeletion 
      :show="showDeletionDialog"
      :title="`هل تريد حذف هذه المعاملة المالية`"
      :text="`سيتم حذف هذه المعاملة نهائيا`"
      @canceled="showDeletionDialog = false"
      @confirmed="deleteTransaction"
    />
    <v-card-title >
      {{transaction.date}}
      <v-spacer></v-spacer>
      <v-btn color="primary" text route :to="`/employees/${employee.id}`">
        {{employee.name}}
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title >
      {{transaction.type}}
      <v-spacer></v-spacer>
      {{transaction.amount}} جنيه
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h3>اضافات</h3>
      {{transaction.notes}}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-btn color="info" large route :to='`/print/transactions/${transaction.id}`'>
        <v-icon right>mdi-printer</v-icon>
        <span>طباعة</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" large @click="showDeletionDialog = true">
        <v-icon right>mdi-delete</v-icon>
        <span>حذف</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import db from '../db';
import ConfirmDeletion from '../components/ConfirmDeletion';

export default {
  components: {ConfirmDeletion},
  data: ()=>({
    transaction: {},
    employee: {},
    showDeletionDialog: false
  }),
  async created(){
    await this.loadTransactionData();
  },
  methods: {
    async loadTransactionData(){
      const DB = await db.getConnection();
      this.transaction = await DB.get('SELECT * FROM money_transactions WHERE id = :id', {
        ":id": this.$route.params.id
      });

      this.employee = await DB.get('SELECT * FROM employees WHERE id = :id', {
        ":id": this.transaction.employee_id
      });
    },
    async deleteTransaction(){
      const DB = await db.getConnection();
      await DB.run('DELETE FROM money_transactions WHERE id = :id',{
        ":id": this.transaction.id
      });
      this.showDeletionDialog = false;
      window.history.back();
    }
  }
}
</script>

<style>

</style>