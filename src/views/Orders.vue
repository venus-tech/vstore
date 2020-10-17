<template>
  <v-card>
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#sells">
        <v-icon right>mdi-cart-arrow-up</v-icon> المبيعات
      </v-tab>

      <v-tab href="#purchases">
        <v-icon right>mdi-cart-arrow-down</v-icon> المشتريات
      </v-tab>
      
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="sells">
        <Sells />
      </v-tab-item>
      <v-tab-item value="purchases">
        <Purchaces />
      </v-tab-item>
       <v-tab-item value="canceled">
        <Canceled />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Sells from '../components/Orders/Sells';
import Purchaces from '../components/Orders/Purchaces';
import Canceled from '../components/Orders/Canceled';

export default {
  components : {
    Sells ,
    Purchaces ,
    Canceled
  } ,
  data() {
    return {
      tab: null
    };
  }
};
</script>

<style>
</style>