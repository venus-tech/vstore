<template>
  <v-card>
    <EditAgency
      :show="showEditAgencyDialog"
      :agency="Object.assign({}, agency)"
      @updated="updated"
      @canceled="showEditAgencyDialog = false"
    />
    <EditAgentDiscounts
      :show="showEditAgencyDiscountDialog"
      :agency="Object.assign({}, agency)"
      @updated="updated"
      @canceled="showEditAgencyDiscountDialog = false"
    />
    <ConfirmDeletion
      title="هل تريد ارشفة بيانات هذا المتجر"
      text="عند الارشفة سيزال هذا المتجر من قائمة المتاجر"
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      @confirmed="archive"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات المتجر
      </v-tab>

      <v-tab href="#discounts">
        <v-icon right>mdi-currency-usd-off</v-icon> الخصومات
      </v-tab>

      <v-tab href="#sells">
        <v-icon right>mdi-cart-arrow-up</v-icon> المبيعات
      </v-tab>

      <v-tab href="#purchases">
        <v-icon right>mdi-cart-arrow-down</v-icon> المشتريات
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="data">
        <v-card flat>
          <v-card-title>
            {{ agency.name }}
            <v-spacer></v-spacer>
            # {{ agency.id }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            {{ agency.address }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            أرقام الهاتف
            <v-spacer></v-spacer>
            <v-chip
              v-for="(num, i) of agency.phone_numbers"
              :key="i"
              class="mx-2"
              >{{ num }}</v-chip
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3>اضافات</h3>
            {{ agency.notes }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="success" large @click="showEditAgencyDialog = true">
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" large @click="showConfirmDeletion = true">
              <v-icon left>mdi-archive</v-icon>
              <span>ارشفة</span>
            </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
        </v-card>
        <v-card class="ma-4" outlined>
          <v-card-title>
            عدد طلبيات البيع : {{ sellsAccount.count }}
            <v-spacer></v-spacer>
            مجمل الفواتير : {{ sellsAccount.bills }} ج
            <v-spacer></v-spacer>
            مجمل التخفيضات : {{ sellsAccount.discounts }} ج
          </v-card-title>
          <v-card-title>
            مجمل المطلوب : {{ sellsAccount.amount }} ج
            <v-spacer></v-spacer>
            مجمل المدفوع : {{ sellsAccount.payed }} ج
            <v-spacer></v-spacer>
            <span :class="{ 'red--text': Number(sellsAccount.debt) > 0 }">
              مجمل الديون : {{ sellsAccount.debt }} ج
            </span>
          </v-card-title>
        </v-card>

        <v-card class="ma-4" outlined>
          <v-card-title>
            عدد طلبيات الشراء : {{ purchacesAccount.count }}
            <v-spacer></v-spacer>
            مجمل الفواتير : {{ purchacesAccount.bills }} ج
          </v-card-title>
          <v-card-title>
            مجمل التخفيضات : {{ purchacesAccount.discounts }} ج
            <v-spacer></v-spacer>
            مجمل المطلوب : {{ purchacesAccount.amount }} ج
          </v-card-title>
        </v-card>
        <br />
      </v-tab-item>
      <v-tab-item value="discounts">
        <v-card flat>
          <v-card-title>
            خصومات المتجر
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              large
              @click="showEditAgencyDiscountDialog = true"
            >
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="agency.discount_table"
              class="elevation-1"
              :search="search"
            >
              <template v-slot:item.value="{ item }">
                {{item.value}} 
                <v-icon>{{item.type == 'percent' ? `mdi-percent` : `mdi-currency-gbp`}}</v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="sells">
        <AgentSells :id="Number($route.params.id)" />
      </v-tab-item>
      <v-tab-item value="purchases">
        <AgentPurchaces :id="Number($route.params.id)" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import db from "../db";

import ConfirmDeletion from "../components/ConfirmDeletion";
import EditAgency from "../components/Agents/EditAgent";
import EditAgentDiscounts from "../components/Agents/EditAgentDiscounts";
import AgentSells from "../components/Agents/AgentSells";
import AgentPurchaces from "../components/Agents/AgentPurchaces";

export default {
  components: {
    EditAgency,
    ConfirmDeletion,
    AgentSells,
    AgentPurchaces,
    EditAgentDiscounts,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "سبب الخصم", value: "description", align: "right" },
        { text: "القيمة", value: "value", align: "left" },
      ],
      showConfirmDeletion: false,
      showEditAgencyDialog: false,
      showEditAgencyDiscountDialog: false,
      tab: null,
      agency: {
        discount_table: [],
      },
      sellsAccount: {},
      purchacesAccount: {},
    };
  },

  async created() {
    await this.loadAgencyData();
  },

  methods: {
    async loadAgencyData() {
      const DB = await db.getConnection();
      const response = await DB.get("SELECT * FROM agencies WHERE id = :id", {
        ":id": this.$route.params.id,
      });

      response.phone_numbers = response.phone_numbers.split(",");
      response.discount_table = JSON.parse(response.discount_table);
      this.agency = response;
      console.log(this.agency);
      this.sellsAccount = await DB.get(
        `
        SELECT 
          sum(total_bill) as bills,
          sum(discount) as discounts,
          sum(total_bill - discount) as amount,
          sum(payed) as payed,
          sum(total_bill - discount - payed) as debt,
          count(*) as count
        from orders
        WHERE 
          type = 'تصدير'
          AND
          agency_id = :id
      `,
        { ":id": this.$route.params.id }
      );

      this.purchacesAccount = await DB.get(
        `
        SELECT 
          sum(total_bill) as bills,
          sum(discount) as discounts,
          sum(total_bill - discount) as amount,
          count(*) as count
        from orders
        WHERE 
          type = 'توريد'
          AND
          agency_id = :id
      `,
        { ":id": this.$route.params.id }
      );
    },
    updated(newData) {
      this.showEditAgencyDialog = false;
      this.showEditAgencyDiscountDialog = false;
      const newRow = Object.assign({}, newData);
      newRow.phone_numbers = newRow.phone_numbers.split(",");
      this.agency = newRow;
    },
    async archive() {
      const DB = await db.getConnection();

      await DB.run("UPDATE agencies SET archived = 1 WHERE id = :id", {
        ":id": this.agency.id,
      });

      this.showConfirmDeletion = false;

      window.history.back();
    },
  },
  computed: {},
};
</script>

<style>
</style>