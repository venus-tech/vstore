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
            إيصال مالي
        </h3>
        <br><br>
        <table cellspacing="0" border="1" width="100%">
            <tr>
                <td width="30%"><h3 class="pa-3">رقم العملية</h3> </td>
                <td class="pa-3"> {{transaction.id}} </td>
            </tr>
            <tr>
                <td width="30%"><h3 class="pa-3">تاريخ العملية</h3> </td>
                <td class="pa-3"> {{transaction.date}} </td>
            </tr>
            <tr>
                <td width="30%"><h3 class="pa-3">نوع العملية</h3> </td>
                <td class="pa-3"> {{transaction.type}} </td>
            </tr>
            <tr>
                <td width="30%"><h3 class="pa-3"> المبلغ </h3> </td>
                <td class="pa-3"> <strong> {{transaction.amount}} ج </strong> </td>
            </tr>
            <tr>
                <td width="30%"><h3 class="pa-3"> الموظف </h3> </td>
                <td class="pa-3"> {{employee.name}} </td>
            </tr>
            <tr>
                <td width="30%"><h3 class="pa-3">ملاحظات واضافات</h3> </td>
                <td class="pa-3"> {{transaction.notes}} </td>
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
  data: ()=>({
    transaction: {},
    employee: {} ,
    CompanyInformations: {}
}),
  async created(){
    this.CompanyInformations = JSON.parse(window.localStorage.getItem('companyInformations'));
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