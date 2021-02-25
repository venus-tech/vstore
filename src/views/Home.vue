<template>
    <v-row>
      <v-col class="d-flex align-self-start">
        
        <v-card class="mx-auto pa-4" max-width="900">
          <v-card-text>
            <v-row>
              <v-col style="tex-align: center !important" class="px-auto">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <img width="256"  alt="Venus logo" src="../assets/venus.jpg">
                  <v-spacer></v-spacer>
                </v-card-title>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col class="pa-4">
                <span  v-for="(itm, index) of items" :key="index">
                  <br v-if="index%2 == 0">
                  <v-btn color="primary" class="mx-1 my-1" outlined rounded large route :to="itm.route">
                    {{itm.title}}
                  </v-btn>
                </span>
              </v-col>
            </v-row>
          </v-card-text>
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
        { title: "المنتجات والاصناف", icon: "mdi-barcode", route: "/products" },
        { title: "المتاجر", icon: "mdi-store", route: "/agents" },
        {
          title: "الموظفين",
          icon: "mdi-account-group-outline",
          route: "/employees"
        },
        { title: "الطلبيات", icon: "mdi-shopping", route: "/orders" },
        { title: "الشيكات", icon: "mdi-card-bulleted-outline", route: "/cheques" },
        { title: "حركة مالية", icon: "mdi-cash-register", route: "/transactions" },
        { title: "إحصائيات", icon: "mdi-chart-areaspline", route: "/statistics" },
        { title: "الإعدادات", icon: "mdi-settings", route: "/settings" },

      ]
    };
  },
  name: 'Home',
  components: {
  },
}
</script>
