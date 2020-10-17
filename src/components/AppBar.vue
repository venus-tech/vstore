<template>
  <v-app-bar app elevation-10>
    <v-btn x-large color="success" route to="/makeOrder">
      

      <span> السلة </span>

      <v-chip class="mx-2  px-4"> 
        <strong class="ml-2">
          {{ $store.getters["Cart/products"].length }} 
        </strong>
        <v-icon >mdi-cart-outline</v-icon>
      </v-chip>
      <v-chip class=""> {{ total }} جنيه</v-chip>
    </v-btn>
    
    <v-spacer></v-spacer>
    <v-btn text icon color="primary" @click="toggleTheme" outlined>
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>

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
  methods:{
    toggleTheme(){
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    exitApp(){
      window.close();
    },
    goForward(){
      window.history.forward();
    },
    goBack(){
      window.history.back();
    }
  },
  computed: {
    total(){
      let sum = 0 ;
      if(this.$store.getters['Cart/orderType'] == 'تصدير'){
        for(let i = 0 ; i < this.$store.getters['Cart/products'].length; i++){
          sum += 
            Number(this.$store.getters['Cart/products'][i].price)
            * 
            Number(this.$store.getters['Cart/products'][i].quantity)
          ;
        }
      }
      if(this.$store.getters['Cart/orderType'] == 'توريد'){
        for(let i = 0 ; i < this.$store.getters['Cart/products'].length; i++){
          sum += 
            Number(this.$store.getters['Cart/products'][i].buy_price)
            * 
            Number(this.$store.getters['Cart/products'][i].quantity)
          ;
        }
      }
      return sum;
    }
  }
};
</script>

<style>
</style>