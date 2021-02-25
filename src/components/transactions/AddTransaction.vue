<template>
  <v-dialog
    v-model="show"
    scrollable  
    persistent 
    max-width="960px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-plus</v-icon>
        <span>إضافة  معاملة مالية</span>
        <v-spacer></v-spacer>
        {{employee.name}}
      </v-card-title>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
              <v-select
                outlined
                :items="typeOptions"
                v-model="transaction.type"
                label="نوع المعاملة"
                :error-messages="typeErrors"
              ></v-select>
          </v-col>
          <v-col>
            <v-text-field 
                type="number" 
                :min="0.01" 
                v-model="transaction.amount" 
                :error-messages="amountErrors" 
                label="المبلغ" 
                outlined
                suffix="  جنيه"
                :step="0.01"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="transaction.notes" outlined label=" اضافات " auto-grow rows="3" counter="65000"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="addTransaction">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '../../db';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    employee: {
      type: Object
    }
  },
  data: ()=>({
    typeOptions: ['صرف', 'ايداع'],
    transaction: {
      id: null,
      date: null,
      type: null,
      amount: 0.00,
      notes: ''
    },
    amountErrors: [],
    typeErrors: [],
  }),
  methods: {
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async addTransaction(){
      this.amountErrors = [];
      this.typeErrors = [];
      if (this.transaction.amount < 0.01){
        this.amountErrors.push('اقل مبلغ ممكن هو 0.01 جنيه');
        return false;
      }

      if(this.typeOptions.indexOf(this.transaction.type) == -1){
        this.typeErrors.push('اختر نوع المعاملة');
        return false;
      }

      const DB = await db.getConnection();

      const sql = `
        INSERT INTO money_transactions (date, type, employee_id, amount, notes)
        VALUES (datetime('now', 'localtime'), :type, :employee_id, :amount, :notes)
      ` ;
      this.transaction.date =  new Date().toLocaleString();
      const data = {
        ":type": this.transaction.type,
        ":employee_id": this.employee.id,
        ":amount": this.transaction.amount,
        ":notes": this.transaction.notes
      };

      const response = await DB.run(sql, data);

      this.transaction.id = response.lastID ;
      this.$emit('inserted', this.transaction);
    }
  }
}
</script>

<style>

</style>