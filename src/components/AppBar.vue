<template>
  <v-app-bar app elevation-10>
    <v-btn text icon color="primary" @click="toggleTheme" outlined class="mx-3">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <div v-if="['توريد' , 'تصدير'].indexOf($store.getters['Cart/orderType']) == -1" class="mx-2">

      <v-btn large color="primary" outlined rounded class="mx-2"
        @click="$store.commit('Cart/setOrderType', 'توريد');" route to="/makeOrder"
      >
        <v-icon right>mdi-cart-arrow-down</v-icon>
        <span class="mx-2" left>توريد منتجات</span>
      </v-btn>

      <v-btn large color="success" outlined rounded 
      @click="$store.commit('Cart/setOrderType', 'تصدير');" route to="/makeOrder">
        <v-icon right>mdi-cart-arrow-up</v-icon>
        <span class="mx-2" left>تصدير منتجات</span>
      </v-btn>
    </div>
    
    <div v-else>
      <v-btn
        large
        :color="$store.getters['Cart/orderType'] == 'توريد' ? 'primary' : 'success' "
        route
        to="/makeOrder"
        class="mx-4"
        outlined
        rounded
      >
        
        <strong class="ml-2">
          {{ $store.getters["Cart/products"].length }}
        </strong>
        <v-icon>{{$store.getters["Cart/orderType"] == 'توريد' ? 'mdi-cart-arrow-down' : 'mdi-cart-arrow-up'}}</v-icon>
        <span class="mx-2"></span>
        {{ total }} جنيه
      </v-btn>
    </div>


    <v-btn text icon color="primary" @click="goForward" class="mx-2">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <v-btn text icon color="primary" @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    exitApp() {
      window.close();
    },
    goForward() {
      window.history.forward();
    },
    goBack() {
      window.history.back();
    },
  },
  computed: {
    total() {
      let sum = 0;
      if (this.$store.getters["Cart/orderType"] == "تصدير") {
        for (let i = 0; i < this.$store.getters["Cart/products"].length; i++) {
          sum +=
            Number(this.$store.getters["Cart/products"][i].price) *
            Number(this.$store.getters["Cart/products"][i].quantity);
        }
      }
      if (this.$store.getters["Cart/orderType"] == "توريد") {
        for (let i = 0; i < this.$store.getters["Cart/products"].length; i++) {
          sum +=
            Number(this.$store.getters["Cart/products"][i].buy_price) *
            Number(this.$store.getters["Cart/products"][i].quantity);
        }
      }
      return sum;
    },
  },
};
</script>

<style></style>
