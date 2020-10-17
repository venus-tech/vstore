<template>
  <v-card>
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#catogories" >
        <v-icon right>mdi-tag-multiple</v-icon>الأصناف
      </v-tab>

      <v-tab href="#products">
        <v-icon right>mdi-barcode-scan</v-icon>المنتجات
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="catogories">
        <CatogoriesTab />
      </v-tab-item>
      <v-tab-item value="products">
          <ProductsTab />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ProductsTab from "../components/Products/Products";
import CatogoriesTab from "../components/Products/Catogories";


//f
export default {
  components: {
    ProductsTab ,
    CatogoriesTab
  },
  
  data() {
    return {
      tab: null
    };
  },

  methods:{
  }
};
</script>