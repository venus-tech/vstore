<template>
  <v-card>
    <EditCheque
      :show="showEditCheque"
      :cheque="Object.assign({},cheque)"
      @canceled="showEditCheque = false"
      @updated="updated"
    />

    <ConfirmDeletion 
      :show="showConfirmDeletion"
      :title="`هل تريد حذف بيانات الشيك`"
      :text="`قد تكون بيانات الشيك مرتبطة بعمليات دفع  لطلبية ما`"
      @canceled="showConfirmDeletion = false"
      @confirmed="deleteCheque"
    />
    
    <v-card-title >
      [#{{cheque.id}}] {{cheque.status}}
      <v-spacer></v-spacer>
      {{cheque.serial_number}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title >
      {{cheque.date}}
      <v-spacer></v-spacer>
      {{cheque.payer_name}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title >
      المبلغ : {{cheque.amount}} جنيه
      <v-spacer></v-spacer>
      المنطقة : {{cheque.area}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title >
      البنك : {{cheque.bank}}
      <v-spacer></v-spacer>
      الفرع : {{cheque.branch}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h3>اضافات</h3>
      {{cheque.notes}}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-btn color="success" large @click="showEditCheque = true">
        <v-icon left>mdi-pencil</v-icon>
        <span>تعديل</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" large @click="showConfirmDeletion = true">
        <v-icon left>mdi-delete</v-icon>
        <span>حذف</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import db from '../db'

import EditCheque from '../components/Cheques/EditCheque';
import ConfirmDeletion from '../components/ConfirmDeletion';

export default {
  components: {EditCheque, ConfirmDeletion},
  data: ()=>({
    showEditCheque: false,
    showConfirmDeletion: false,
    cheque: {},
  }),
  async created(){
    await this.loadChequeData();
  },
  methods: {
    async loadChequeData(){
      const DB = await db.getConnection();
      this.cheque = await DB.get('SELECT * FROM cheques WHERE id = :id', {
        ":id": this.$route.params.id
      });
    },
    updated(cheque){
      this.cheque = cheque;
      this.showEditCheque = false;
    },
    async deleteCheque(){
      const DB = await db.getConnection();
      await DB.run('DELETE FROM cheques WHERE id = :id', {
        ":id": this.cheque.id 
      });
      window.history.back();
    }
  }
}
</script>

<style>

</style>