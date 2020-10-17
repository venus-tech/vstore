<template>
    <v-row>
      <v-col class="d-flex align-self-start">
        
        <v-card class="mx-auto">
          <v-card-title >
            <img width="256" class="mx-auto"  alt="Venus logo" src="../assets/venus.jpg">
            شركة اولاد عثمان للمنتجات الطبية 
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="primary" outlined rounded large v-for="itm of items" :key="itm.route" route :to="itm.route">
              {{itm.title}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'



export default {
  data(){
    return {
      categories : [],
      loading: false,
      items: [
        //{ title: "الرئيسية", icon: "mdi-view-dashboard-outline", route: "/" },
        { title: "المنتجات", icon: "mdi-barcode", route: "/products" },
        { title: "المتاجر", icon: "mdi-store", route: "/agents" },
        {
          title: "الموظفين",
          icon: "mdi-account-group-outline",
          route: "/employees"
        },
        { title: "الطلبيات", icon: "mdi-shopping", route: "/orders" },
        { title: "الشيكات", icon: "mdi-card-bulleted-outline", route: "/cheques" },
        { title: "حركة مالية", icon: "mdi-cash-register", route: "/transactions" },
        { title: "إحصائيات", icon: "mdi-chart-areaspline", route: "/statistics" }
      ]
    };
  },
  name: 'Home',
  components: {
  },
}
</script>
