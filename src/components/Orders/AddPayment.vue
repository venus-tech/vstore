<template>
  <v-dialog
    v-model="show"
    scrollable  
    persistent 
    max-width="960px"
    transition="dialog-transition"
  >
    <v-card :loading="loading">
      <v-card-title color="primary" >
        <v-spacer></v-spacer>
        اضافة عملية دفع
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-title >
        المطلوب {{payment.bill}} <v-spacer></v-spacer>
        المدفوع {{payment.payed}} <v-spacer></v-spacer>
        المتبقي {{payment.debt}} 
      </v-card-title>
      <v-card-text class="pa-6">
        <v-row>
          <v-col> 
            <v-text-field 
              v-model="amount" 
              :error-messages="amountErrors" 
              label="القيمة"
              type="number"
              step="0.01"
              :max="payment.debt"
              :min="0.01"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea 
              v-model="notes" 
              outlined 
              label=" بيانات إضافية عن عملية الدفع " 
              auto-grow 
              rows="3" 
              counter="65000"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="addPayment" :disabled="Number(payment.debt) <= 0.00">
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
      default: false
    },
    orderId:{
      type: Number,
      required: true
    }
  },
  data: ()=>({
    loading: true,
    amount: null,
    notes: "",
    amountErrors: [],
    payment: 0.0
  }),
  async beforeMount(){
    await this.getPayment();
  },
  methods: {
    async getPayment(){
      this.loading = true;
      const DB = await db.getConnection();
      const sql = `
        SELECT  
          total_bill as bill, 
          payed,
          (total_bill  - payed) as debt
        FROM orders 
        WHERE id = :id
      `;

      this.payment = await DB.get(sql, {":id": this.orderId});
      this.loading = false;
    },
    async addPayment(){
      this.amountErrors = [];
      if (this.amount < 0.01 || this.amount > this.payment.debt){
        this.amountErrors.push(`يجب ان يكون المبلغ على الاقل 0.01 وعلى الاكثر ${this.payment.debt}`)
        return false;
      }
      
      this.loading = true;
      const DB = await db.getConnection();
      
      const addPaymentSQL = `
        INSERT INTO order_payment
        (order_id, date, amount, note)
        VALUES
        (:order_id, datetime('now', 'localtime'), :amount, :note)
      `;
      const date = (new Date()).toLocaleString();
      const addPaymentData = {
        ":order_id" : this.orderId,
        ":amount": this.amount,
        ":note": this.notes
      };
      const response = await DB.run(addPaymentSQL, addPaymentData);
      const newPayment = {
        id: response.lastID,
        order_id: this.orderId,
        date: date,
        amount: this.amount,
        note: this.notes
      };
      this.payment.payed = Number(this.payment.payed) + Number(this.amount);
      this.payment.debt = Number(this.payment.debt) - Number(this.amount);

      const updatePayedAmountSQL = `
        UPDATE orders 
        SET payed = payed + :newAmount
        WHERE id = :id
      `;
      const updatePayedAmountData = {
        ":newAmount": this.amount,
        ":id": this.orderId
      };
      await DB.run(updatePayedAmountSQL, updatePayedAmountData);

      this.loading = false;

      this.$emit('inserted', newPayment);
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    }
  }
}
</script>

<style>

</style>