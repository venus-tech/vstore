<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      app
      right
      primary
      expand-on-hover
      mini-variant-width="72"
    >
      <v-list-item class="px-2 center-text">
        <v-list-item-title class="mx-auto">VStore</v-list-item-title>
      </v-list-item>

      <v-list rounded>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          route
          :to="item.route"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "الرئيسية", icon: "mdi-view-dashboard-outline", route: "/" },
        { title: "المنتجات والاصناف", icon: "mdi-barcode", route: "/products" },
        { title: "الطلبيات", icon: "mdi-shopping", route: "/orders" },
        { title: "المتاجر و العملاء", icon: "mdi-account-group-outline", route: "/agents" },
        {
          title: "الموظفين",
          icon: "mdi-account-tie",
          route: "/employees"
        },
        { title: "الشيكات", icon: "mdi-card-bulleted-outline", route: "/cheques" },
        { title: "حركة مالية", icon: "mdi-cash-register", route: "/transactions" },
        { title: "إحصائيات", icon: "mdi-chart-areaspline", route: "/statistics" },
        { title: "الإعدادات", icon: "mdi-settings", route: "/settings" },
      ],
      mini: true
    };
  }
};
</script>