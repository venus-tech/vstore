<template>
  <v-card flat>
    <v-card-title class="pa-6">
      <v-spacer></v-spacer>
      <v-btn color="info" x-large route :to='`/print/cart`'>
        <v-icon left>mdi-printer</v-icon>
        <span>طباعة</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" x-large @click="goNext">
        <v-icon left>mdi-content-save</v-icon>
        <span>حفظ</span>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  methods: {
    goNext(){
      this.$emit('continue', 'GUI event');
    }
  }
}
</script>

<style>

</style>