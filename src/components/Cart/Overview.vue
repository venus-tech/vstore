<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          <v-text-field
            :label="`المبلغ : ${total}`"
            outlined
            disabled
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            :label="`الضرائب : ${totalTaxs + totalGenralTaxes}`"
            outlined
            disabled
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            prefix="التخفيض :"
            outlined
            type="number"
            disabled
            v-model="totalGenralDiscounts"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            :label="`المطلوب : ${amount}`"
            outlined
            disabled
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels focusable style="border: 1px solid #CCC">
        <v-expansion-panel focusable>
          <v-expansion-panel-header>
            الضرائب العامة ( {{ totalGenralTaxes }} )
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card outlined class="mt-4">
              <v-card-title primary-title>
                هيكل الضرائب العامة
                <v-spacer></v-spacer>
                {{ totalGenralTaxes }} <v-icon>mdi-currency-gbp</v-icon>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  :headers="taxsTableHeaders"
                  :items="taxsTableItems"
                  hide-default-footer
                  rounded
                >
                  <template v-slot:item.value="{ item }">
                    <v-text-field
                      name="name"
                      label="قيمة الضريبة"
                      v-model="item.value"
                      outlined
                      type="number"
                      :min="0.0"
                      :step="0.1"
                      class="ma-2"
                      @click:append="
                        item.type == 'percent'
                          ? (item.type = 'value')
                          : (item.type = 'percent')
                      "
                      :append-icon="
                        item.type == 'percent'
                          ? 'mdi-percent'
                          : 'mdi-currency-gbp'
                      "
                    ></v-text-field>
                  </template>
                  <template v-slot:item.description="{ item }">
                    <v-textarea
                      v-model="item.description"
                      outlined
                      label="البيان"
                      auto-grow
                      rows="1"
                      counter="65000"
                    ></v-textarea>
                  </template>
                  <template v-slot:item.remove="{ item }">
                    <v-btn
                      text
                      icon
                      color="error"
                      @click="removeTaxsTableItem(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  large
                  class="ma-2"
                  color="primary"
                  @click="appendTaxsTableItem"
                >
                  <v-icon left>mdi-plus-box</v-icon>
                  <span>إضافة</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel focusable>
          <v-expansion-panel-header>
            الخصومات العامة ( {{ totalGenralDiscounts }} )
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card outlined class="mt-4">
              <v-card-title primary-title>
                هيكل الخصومات العامة
                <v-spacer></v-spacer>
                {{ totalGenralDiscounts }} <v-icon>mdi-currency-gbp</v-icon>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-data-table
                  :headers="discountsTableHeaders"
                  :items="discountsTableItems"
                  hide-default-footer
                  rounded
                >
                  <template v-slot:item.value="{ item }">
                    <v-text-field
                      name="name"
                      label="قيمة الخصم"
                      v-model="item.value"
                      outlined
                      type="number"
                      :min="0.0"
                      :step="0.1"
                      class="ma-2"
                      @click:append="
                        item.type == 'percent'
                          ? (item.type = 'value')
                          : (item.type = 'percent')
                      "
                      :append-icon="
                        item.type == 'percent'
                          ? 'mdi-percent'
                          : 'mdi-currency-gbp'
                      "
                    ></v-text-field>
                  </template>
                  <template v-slot:item.description="{ item }">
                    <v-textarea
                      v-model="item.name"
                      outlined
                      label="البيان"
                      auto-grow
                      rows="1"
                      counter="65000"
                    ></v-textarea>
                  </template>
                  <template v-slot:item.remove="{ item }">
                    <v-btn
                      text
                      icon
                      color="error"
                      @click="removeDiscountsTableItem(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  large
                  class="ma-2"
                  color="primary"
                  @click="appendDiscountsTableItem"
                >
                  <v-icon left>mdi-plus-box</v-icon>
                  <span>إضافة</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-text>
      <v-textarea
        outlined
        v-model="notes"
        label="بيانات اضافية"
        auto-grow
        rows="5"
        counter="65000"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <save-print
        @continue="
          step = 5;
          updatediscounsStore();
          updateTaxesStore();
          saveOrder();
        "
        @saveProformaInvoice="
          updatediscounsStore();
          updateTaxesStore();
          saveProformaInvoice();
        "
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import db from "../../db";
import SavePrint from "./SavePrint.vue";

export default {
  components: { SavePrint },
  data: () => ({
    discounts: [],
    taxes: [],
    discount: 0,
    notes: "",
    taxsTableItems: [{ value: 0.0, description: "", type: "percent" }],
    taxsTableHeaders: [
      {
        text: "الضريبة",
        sortable: false,
        value: "value",
      },
      {
        text: "البيان",
        sortable: false,
        value: "description",
      },
      {
        text: "ازالة",
        align: "left",
        sortable: false,
        value: "remove",
      },
    ],
    discountsTableItems: [{ value: 0.0, description: "", type: "percent" }],
    discountsTableHeaders: [
      {
        text: "الخصم",
        sortable: false,
        value: "value",
      },
      {
        text: "البيان",
        sortable: false,
        value: "description",
      },
      {
        text: "ازالة",
        align: "left",
        sortable: false,
        value: "remove",
      },
    ],
  }),
  created() {
    this.taxsTableItems = this.$store.getters["Cart/taxes"];
    this.discountsTableItems = this.$store.getters["Cart/discounts"];
    // this.discount = this.$store.getters['Cart/discount'];
    this.notes = this.$store.getters["Cart/notes"];
    if(!this.$store.getters['Cart/isGeneralConfigurationsLoaded']){
      const generalTaxes = JSON.parse(window.localStorage.getItem('generalTaxes'));
      this.taxsTableItems = generalTaxes;
      // this.discountsTableItems = this.$store.getters['Cart/agency'].discount_table;
      // console.log(this.$store.getters['Cart/agency'].discount_table);
      this.$store.commit('Cart/configurationsLoaded');
    }
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
    amount() {
      return (
        this.total +
        this.totalTaxs +
        this.totalGenralTaxes -
        this.totalGenralDiscounts
      );
    },
    totalTaxs() {
      let total = 0;
      const products = this.$store.getters["Cart/products"];
      let taxs_table = [];
      let sum = 0;
      let amount = 0;
      let unit_price = 0;
      let quantity = 0;
      for (let product of products) {
        taxs_table = JSON.parse(product.taxs_table);
        unit_price = product.price;
        quantity = Number(product.quantity);
        sum = 0;
        amount = 0;
        for (let item of taxs_table) {
          amount = Number(item.value);
          if (item.type == "percent") {
            amount = amount / 100;
            amount = amount * Number(unit_price);
          }
          sum += amount * quantity;
        }
        total += sum;
      }

      return total;
    },
    totalGenralTaxes() {
      let sum = 0;
      let amount = 0;
      for (let item of this.taxsTableItems) {
        amount = Number(item.value);
        if (item.type == "percent") {
          amount = amount / 100;
          amount = amount * this.total;
        }
        sum += amount;
      }
      return sum;
    },
    totalGenralDiscounts() {
      let sum = 0;
      let amount = 0;
      for (let item of this.discountsTableItems) {
        amount = Number(item.value);
        if (item.type == "percent") {
          amount = amount / 100;
          amount = amount * this.total;
        }
        sum += amount;
      }
      return sum;
    },
  },
  methods: {
    goNext() {
      //alert('Printer Error: System Error code 0x0093');
      this.$store.commit("Cart/setDiscount", this.discount);
      this.$store.commit("Cart/setNotes", this.notes);

      this.$emit("continue", "GUI event");
    },
    async saveOrder() {
      const DB = await db.getConnection();

      // TODO: save order
      // TODO: save order products

      const addOrderSQL = `
        INSERT INTO orders 
        (date, agency_id, bill, total_bill, total_taxes, discount, taxes_table, discounts_table, agent_name, type, notes, employee_id)
        VALUES
        (datetime('now', 'localtime'), :agency_id, :bill, :total_bill, :total_taxes, :discount, :taxes_table, :discounts_table, :agent_name, :type, :notes, :employee_id)
      `;

      const orderData = {
        ":agency_id": this.$store.getters["Cart/agency"].id,
        ":bill": this.total,
        ":total_taxes": this.totalGenralTaxes + this.totalTaxs,
        ":total_bill": this.amount,
        ":discount": this.totalGenralDiscounts,
        ":taxes_table": JSON.stringify(this.taxsTableItems),
        ":discounts_table": JSON.stringify(this.discountsTableItems),
        ":agent_name": this.$store.getters["Cart/agentName"],
        ":type": this.$store.getters["Cart/orderType"],
        ":notes": this.$store.getters["Cart/notes"],
        ":employee_id": this.$store.getters["Cart/employee"].id,
      };

      const response = await DB.run(addOrderSQL, orderData);

      const orderId = response.lastID;

      const addProductsSQL = `
        INSERT INTO order_product
        (order_id, product_id, quantity, price, buy_price, discount)
        values
        (:order_id, :product_id, :quantity, :price, :buy_price, :discount)
      `;

      let productsData = {
        ":order_id": orderId,
        ":product_id": 0.0,
        ":quantity": 0.0,
        ":price": 0.0,
        ":buy_price": 0.0,
        ":discount": 0.0,
      };

      const updateInStoreQuantitySQL = `
        UPDATE products 
        SET in_store_quantity = in_store_quantity + :newQantity 
        WHERE id = :id
      `;

      let updateInStoreQuantityData = {
        ":newQantity": 0.0,
        ":id": 0,
      };

      let newQantity = 0.0;

      for (let i = 0; i < this.$store.getters["Cart/products"].length; i++) {
        productsData[":product_id"] = this.$store.getters["Cart/products"][
          i
        ].id;
        productsData[":quantity"] = this.$store.getters["Cart/products"][
          i
        ].quantity;
        productsData[":price"] = this.$store.getters["Cart/products"][i].price;
        productsData[":buy_price"] = this.$store.getters["Cart/products"][
          i
        ].buy_price;

        await DB.run(addProductsSQL, productsData);

        updateInStoreQuantityData[":id"] = this.$store.getters["Cart/products"][
          i
        ].id;

        newQantity = Math.abs(
          Number(this.$store.getters["Cart/products"][i].quantity)
        );
        if (this.$store.getters["Cart/orderType"] == "تصدير") {
          newQantity = -1 * newQantity;
        }
        updateInStoreQuantityData[":newQantity"] = newQantity;

        await DB.run(updateInStoreQuantitySQL, updateInStoreQuantityData);
      }

      this.step = 1;
      try {
        this.$store.commit("Cart/resetCart");
        this.$router.push("/orders/" + orderId);
        this.$emit("inserted", orderId);
      } catch (error) {
        console.error(error);
      }
    },
    async saveProformaInvoice() {
      const DB = await db.getConnection();

      const addCartSQL = `
        INSERT INTO proforma_invoice (data) VALUES (:data)
      `;

      const cartData = this.$store.getters["Cart/export"];

      const response = await DB.run(addCartSQL, cartData);

      console.log(response);
    },
    sanitizeTaxsTable() {
      for (let i in this.taxsTableItems) {
        if (
          Number(this.taxsTableItems[i].value) == 0.0 &&
          this.taxsTableItems[i].description.trim() == ""
        ) {
          this.taxsTableItems.splice(i, 1);
        }
      }
    },
    removeTaxsTableItem(item) {
      this.taxsTableItems.splice(this.taxsTableItems.indexOf(item), 1);
    },
    appendTaxsTableItem() {
      this.sanitizeTaxsTable();
      this.taxsTableItems.push({ value: "", description: "", type: "percent" });
    },
    sanitizeDiscountsTable() {
      for (let i in this.discountsTableItems) {
        if (
          Number(this.discountsTableItems[i].value) == 0.0 &&
          this.discountsTableItems[i].description.trim() == ""
        ) {
          this.discountsTableItems.splice(i, 1);
        }
      }
    },
    removeDiscountsTableItem(item) {
      this.discountsTableItems.splice(
        this.discountsTableItems.indexOf(item),
        1
      );
    },
    appendDiscountsTableItem() {
      this.sanitizeDiscountsTable();
      this.discountsTableItems.push({
        value: "",
        description: "",
        type: "value",
      });
    },
    updatediscounsStore() {
      const table = JSON.stringify(this.discountsTableItems);
      this.sanitizeDiscountsTable();
      this.$store.commit("Cart/setDiscounts", this.discountsTableItems);
      this.discountsTableItems = JSON.parse(table);
    },
    updateTaxesStore() {
      const table = JSON.stringify(this.taxsTableItems);
      this.sanitizeTaxsTable();
      this.$store.commit("Cart/setTaxes", this.taxsTableItems);
      this.taxsTableItems = JSON.parse(table);
    },
  },
  watch: {},
  beforeDestroy() {
    this.updatediscounsStore();
    this.updateTaxesStore();
  },
};
</script>

<style></style>
