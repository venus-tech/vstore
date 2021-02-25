<template>
  <v-card flat :loading="loading" :loader-height="60">
    <ConfirmTruncate 
      :show="showConfrimTruncate"
      @canceled="showConfrimTruncate = false"
      title="هل انت متاكد من انك تريد تفريغ معاملاتك المالية"
      text="ستفقد جميع معاملاتك المالية منها الايصالات والودائع"
      @confirmed="truncateTransactions"
    />
    <v-card-title >
      اعدادات المعاملات المالية
    </v-card-title>
    <v-card-text class="pa-4">
      <v-btn color="error" x-large @click="showConfrimTruncate = true">
        <v-icon left>mdi-delete</v-icon>
        <span>تفريغ المعاملات المالية</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import ConfirmTruncate from '../ConfirmDeletion';
import db from '../../db';


export default {
  components: {ConfirmTruncate},
  data:()=>({
    showConfrimTruncate: false,
    loading: false
  }),
  methods: {
    async truncateTransactions(){
      this.loading = true;
      this.showConfrimTruncate = false;
      //DELETE FROM money_transactions
      const DB = await db.getConnection();
      await DB.run('DELETE FROM money_transactions');
      this.loading = false;
    }
  }
}
</script>

<style>

</style>