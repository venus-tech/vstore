<template>
  <v-dialog
    v-model="show"
    scrollable  
    persistent 
    max-width="960px"
    transition="dialog-transition"
  >
    <ConfirmDeletion
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      title="ازالة عملية الدفع"
      text="ازالة عملية الدفع سيؤدي الى  تسجيل قيمتها كديون على الطلبية وستزال قيمتها من المدفوعات"
      @confirmed="remove"
    />
    <v-card :loading="loading">
      <v-card-title>
        [# {{payment.id}}] {{payment.date}}
        <v-spacer></v-spacer>
        <strong class="green--text" >
            {{ payment.amount }} ج
          </strong>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <h3>اضافات :</h3>{{payment.note}}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn large text color="secondary" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn large color="info" route :to="`/print/payements/${payment.id}`">
          <v-icon left>mdi-printer</v-icon>
          <span>طباعة</span>
        </v-btn>
        <span class="mx-2"></span>
        <v-btn large color="error" @click="showConfirmDeletion = true">
          <v-icon left>mdi-delete</v-icon>
          <span>حذف</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '../../db';

import ConfirmDeletion from '../ConfirmDeletion';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    payment: {
      type: Object,
      required: true
    }
  },
  components: {ConfirmDeletion},
  data: ()=>({
    showConfirmDeletion: false,
    loading: false,
  }),
  methods: {
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async remove(){
      this.loading = true;
      const DB = await db.getConnection();

      const sql = `DELETE FROM order_payment WHERE id = :id`;
      await DB.run(sql, {":id": this.payment.id});

      const updateOrderPayedAmountSQL = `
        UPDATE orders SET payed = payed - :amount WHERE id = :id
      `;
      const updateData = {
        ":amount": Number(this.payment.amount) ,
        ":id": this.payment.order_id
      };
      await DB.run(updateOrderPayedAmountSQL , updateData);

      this.loading = false;
      this.showConfirmDeletion = false;
      this.$emit('removed' , this.payment)
    }
  }
}
</script>

<style>

</style>