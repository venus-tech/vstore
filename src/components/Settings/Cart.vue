<template>
  <v-card flat>
    <v-card-text>
      <v-tabs v-model="tab" :grow="true" dark>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab href="#taxs"> الضرائب العامة </v-tab>
        <v-tab href="#header"> الترويسة </v-tab>
        <v-tab href="#footer"> الذيل </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="taxs" class="pt-6">
          <taxes />
        </v-tab-item>
        <v-tab-item value="header" class="pt-6">
          <CartHeader />
        </v-tab-item>
        <v-tab-item value="footer" class="pt-6">
          <CartFooter />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import CartFooter from './Cart/Footer.vue';
import CartHeader from './Cart/Header.vue';
import Taxes from './Cart/Taxes.vue';
export default {
  components: { Taxes, CartHeader, CartFooter },
  data: () => ({
    tab: 1,
  }),
};
</script>

<style></style>
