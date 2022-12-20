<template>
  <v-card flat>
    <v-card-title>
      <!-- <v-btn color="secondary" x-large @click="saveProformaInvoice">
        <v-icon left>mdi-content-save-settings</v-icon>
        <span> حفظ فاتورة مبدئية </span>
      </v-btn>
      <v-spacer></v-spacer> -->
      <v-btn color="info" large route :to='`/print/cart`' >
        <v-icon left>mdi-printer</v-icon>
        <span>طباعة</span>
      </v-btn>
      <v-spacer class="mx-3"></v-spacer>
      <v-btn color="success" large @click="goNext">
        <v-icon left>mdi-content-save</v-icon>
        <span>حفظ</span>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  methods: {
    goNext(){
      this.$emit('continue', 'GUI event');
    },
    saveProformaInvoice(){
      this.$emit('saveProformaInvoice', 'GUI event');
    },
  }
}
</script>

<style>

</style>