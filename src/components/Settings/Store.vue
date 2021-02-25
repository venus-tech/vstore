<template>
  <v-card flat :loading="loading" :loader-height="60">
    <ConfirmTruncate 
      :show="showConfrimTruncate"
      @canceled="showConfrimTruncate = false"
      title="هل انت متاكد من انك تريد تفريغ المخزن"
      text="عند تفريغ المخزن ستحذف جميع بيانات الطلبيات وايضا سيفرغ المخزن من المنتجات"
      @confirmed="truncateStore"
    />
    <v-card-title >
      اعدادات المخزن
    </v-card-title>
    <v-card-text class="pa-4">
      <v-btn color="error" x-large @click="showConfrimTruncate = true">
        <v-icon left>mdi-delete</v-icon>
        <span>تفريغ المخزن</span>
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
    async truncateStore(){
      this.loading = true;
      this.showConfrimTruncate = false;
      //DELETE FROM order_payment 
      //DELETE FROM order_product
      //DELETE FROM orders
      //UPDATE products SET in_store_quantity = 0

      const DB = await db.getConnection();

      await DB.run('DELETE FROM order_payment');
      await DB.run('DELETE FROM order_product');
      await DB.run('DELETE FROM orders');
      await DB.run('UPDATE products SET in_store_quantity = 0');

      this.loading = false;
    }
  }
}
</script>

<style>

</style>