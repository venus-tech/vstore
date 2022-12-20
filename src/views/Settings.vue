<template>
  <v-card>
    <v-card-title class="pa-0">
      <v-tabs
        v-model="tab"
        color="primary"
        slider-color="primary"
      >
        <v-tab href="#info">
          بيانات الشركة
        </v-tab>
        <v-tab href="#cart">
          الفاتورة
        </v-tab>
        <v-tab href="#store">
          المخزن
        </v-tab><v-tab href="#transactions">
          المعاملات المالية
        </v-tab>
        <!-- <v-tab href="#system">
          اعدادات النظام
        </v-tab> -->
      </v-tabs>
    </v-card-title>
    <v-card-text class="pa-4 pt-6">
      <v-tabs-items v-model="tab">
        <v-tab-item value="info">
          <CompanyInformations />
        </v-tab-item>
        <v-tab-item value="cart">
          <Cart />
        </v-tab-item>
        <v-tab-item value="store">
          <Store />
        </v-tab-item>
        <v-tab-item value="transactions">
          <Transactions />
        </v-tab-item>
        <v-tab-item value="system">
          <SystemSettings />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

  </v-card>
</template>

<script>
import CompanyInformations from '../components/Settings/CompanyInformations';
import Cart from '../components/Settings/Cart';
import Store from '../components/Settings/Store';
import Transactions from '../components/Settings/Transactions';
import SystemSettings from '../components/Settings/System';

export default {
  components: {CompanyInformations, Store, Transactions, SystemSettings, Cart},
  data: () => ({
    tab: null,
  }),
}
</script>

<style>

</style>