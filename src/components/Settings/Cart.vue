<template>
  <v-card flat>
    <v-card-text>
      <v-tabs v-model="tab" :grow="true" dark>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab href="#taxs"> الضرائب العامة </v-tab>
        <v-tab href="#header"> الترويسة </v-tab>
        <v-tab href="footer"> الذيل </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="taxs">

        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    tab: 1,
    taxs: [],
  }),
  created(){
    this.loadTaxs();
  },
  methods: {
    loadTaxs(){}
  }
};
</script>

<style>
</style>