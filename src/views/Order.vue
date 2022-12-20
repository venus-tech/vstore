<template>
  <v-card :loading="loading">
    <ConfirmDeletion
      :show="showCancelDialog"
      @canceled="showCancelDialog = false"
      @confirmed="cancelOrder"
      title="هل فعلا تريد الغاء الطلبية"
      text="يترتب على هذا الاجراء حذف جميع بيانات العملية مما يعني الغاء طلب المنتجات واعادتها الى المخزن مرة اخرى"
    />

    <ConfirmDeletion
      :show="showRemoveDialog"
      @canceled="showRemoveDialog = false"
      @confirmed="removeOrder"
      title="حذف الطلبية"
      text="ستزال بيانات الطلبية دون ارجاع المنتجات الى المخزن"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات الطلبية
      </v-tab>

      <v-tab href="#bill">
        <v-icon right>mdi-currency-usd</v-icon> البيانات المالية
      </v-tab>

      <v-tab href="#taxes">
        <v-icon right>mdi-file-outline</v-icon> الضرائب
      </v-tab>

      <v-tab href="#discounts">
        <v-icon right>mdi-file-outline</v-icon> الخصومات
      </v-tab>

      <v-tab href="#products">
        <v-icon right>mdi-barcode-scan</v-icon> المنتجات
      </v-tab>

      <v-tab href="#payments" v-if="order.type == 'تصدير'">
        <v-icon right>mdi-account-cash-outline</v-icon> عمليات الدفع
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="data" class="pa-4">
        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-title>
                رقم الطلبية
                <v-spacer></v-spacer>
                #{{ order.id }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                نوع الطلبية
                <v-spacer></v-spacer>
                {{ order.type }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                التاريخ
                <v-spacer></v-spacer>
                {{ order.date }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined router :to="`/agents/${agency.id}`">
              <v-card-title class="py-4">
                المتجر
                <v-spacer></v-spacer>
                {{ agency.name }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col v-if="order.agent_name && order.agent_name.trim() != ''">
            <v-card outlined>
              <v-card-title class="py-4">
                العميل
                <v-spacer></v-spacer>
                {{ order.agent_name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined router :to="`/employees/${employee.id}`">
              <v-card-title>
                الموظف
                <v-spacer></v-spacer>
                {{ employee.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-text>
                <h3>ملاحظات و اضافات</h3>
                {{ order.notes }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card flat>
          <v-card-actions class="pa-4">
            <v-btn color="info" x-large route :to="`/print/orders/${order.id}`">
              <v-icon right>mdi-printer</v-icon>
              <span>طباعة</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" x-large @click="showCancelDialog = true">
              <v-icon left>mdi-cancel</v-icon>
              <span>إلغاء الطلبية</span>
            </v-btn>
            <span class="mx-4"></span>
            <v-btn color="error" x-large @click="showRemoveDialog = true">
              <v-icon left>mdi-delete</v-icon>
              <span>حذف الطلبية</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="bill" class="pa-6">
        <div class="my-6"></div>
        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-title>
                المبلغ
                <v-spacer></v-spacer>
                {{ order.bill }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                الضرائب
                <v-spacer></v-spacer>
                {{ order.total_taxes }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                الخصم
                <v-spacer></v-spacer>
                {{ order.discount }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-title>
                المجموع
                <v-spacer></v-spacer>
                {{ order.total_bill }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                المدفوع
                <v-spacer></v-spacer>
                {{ order.payed }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined>
              <v-card-title>
                المتبقي
                <v-spacer></v-spacer>
                <span v-if="order.type == 'تصدير'">
                  <span
                    :class="{
                      'red--text':
                        Number(order.total_bill) - Number(order.payed) > 0,
                    }"
                  >
                    {{ Number(order.total_bill) - Number(order.payed) }}
                    ج
                  </span>
                </span>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="taxes" class="pa-6">
        <div class="my-6"></div>
        <v-row>
          <v-col>
            <v-card outlined class="pa-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card-title>
                      الضرائب على الفاتورة
                    </v-card-title>
                  </v-col>
                  <v-col>
                    <v-text-field
                      type="search"
                      placeholder="فلترة الضرائب"
                      append-icon="mdi-magnify"
                      v-model="search"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="taxesHeaders"
                  :items="order.taxes_table"
                  :search="search"
                >
                  <template v-slot:item.value="{ item }">
                    <span class="font-weight-black">{{ item.value }}</span>
                    <v-icon
                      class="mx-2"
                      color="black"
                      v-text="
                        item.type == 'percent'
                          ? 'mdi-percent'
                          : 'mdi-currency-gbp'
                      "
                    ></v-icon>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="discounts" class="pa-6">
        <div class="my-6"></div>
        <v-row>
          <v-col>
            <v-card outlined class="pa-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card-title>
                      الخصومات على الفاتورة
                    </v-card-title>
                  </v-col>
                  <v-col>
                    <v-text-field
                      type="search"
                      placeholder="فلترة الخصومات"
                      append-icon="mdi-magnify"
                      v-model="search"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="discountsHeaders"
                  :items="order.discounts_table"
                  :search="discountsSearch"
                >
                  <template v-slot:item.value="{ item }">
                    <span class="font-weight-black">{{ item.value }}</span>
                    <v-icon
                      class="mx-2"
                      color="black"
                      v-text="
                        item.type == 'percent'
                          ? 'mdi-percent'
                          : 'mdi-currency-gbp'
                      "
                    ></v-icon>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="products">
        <OrderProducts :id="Number($route.params.id)" />
      </v-tab-item>
      <v-tab-item value="payments">
        <OrderPayments :id="Number($route.params.id)" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import OrderProducts from "../components/Orders/OrderProducts";
import OrderPayments from "../components/Orders/OrderPayments";

import ConfirmDeletion from "../components/ConfirmDeletion";

import db from "../db";

export default {
  components: { OrderProducts, OrderPayments, ConfirmDeletion },
  data() {
    return {
      loading: false,
      showCancelDialog: false,
      showRemoveDialog: false,
      tab: null,
      order: {},
      agency: {},
      employee: {},
      search: "",
      taxesHeaders: [
        { text: "البيان", value: "description" },
        { text: "الضريبة", value: "value", align: "left" },
      ],
      discountsSearch: "",
      discountsHeaders: [
        { text: "سبب الخصم", value: "name" },
        { text: "القيمة", value: "value", align: "left" },
      ],
    };
  },
  async created() {
    await this.loadOrder();
    // console.log(this.order);
  },
  methods: {
    async loadOrder() {
      const DB = await db.getConnection();
      this.order = await DB.get(`SELECT * FROM orders WHERE id = :id`, {
        ":id": this.$route.params.id,
      });

      this.order.taxes_table = JSON.parse(this.order.taxes_table);
      this.order.discounts_table = JSON.parse(this.order.discounts_table);

      this.agency = await DB.get(`SELECT * FROM agencies WHERE id = :id`, {
        ":id": this.order.agency_id,
      });

      this.employee = await DB.get(`SELECT * FROM employees WHERE id = :id`, {
        ":id": this.order.employee_id,
      });
    },
    async cancelOrder() {
      //substract the products from
      //delete all order payments
      //delete all order products
      //delete the order

      this.showCancelDialog = false;

      this.loading = true;

      const DB = await db.getConnection();

      let multiplicationProduct = -1;
      if (this.order.type == "تصدير") {
        multiplicationProduct = 1;
      }

      const products = await DB.all(
        `
        SELECT 
          product_id, 
          (quantity * :MP ) as quantity 
        FROM order_product 
        WHERE order_id = :id 
      `,
        {
          ":MP": multiplicationProduct,
          ":id": this.order.id,
        }
      );

      for (let i = 0; i < products.length; i++) {
        await DB.run(
          `
          UPDATE products 
          SET in_store_quantity = in_store_quantity + :Q 
          WHERE id = :id`,
          {
            ":Q": products[i].quantity,
            ":id": products[i].product_id,
          }
        );
      }

      await DB.run("DELETE FROM order_payment WHERE order_id = :id", {
        ":id": this.order.id,
      });
      await DB.run("DELETE FROM order_product WHERE order_id = :id", {
        ":id": this.order.id,
      });
      await DB.run("DELETE FROM orders WHERE id = :id", {
        ":id": this.order.id,
      });

      this.loading = false;
      window.history.back();
    },
    async removeOrder() {
      this.showRemoveDialog = false;

      this.loading = true;
      const DB = await db.getConnection();
      //delete all order payments
      //delete all order products
      //delete the order

      await DB.run("DELETE FROM order_payment WHERE order_id = :id", {
        ":id": this.order.id,
      });
      await DB.run("DELETE FROM order_product WHERE order_id = :id", {
        ":id": this.order.id,
      });
      await DB.run("DELETE FROM orders WHERE id = :id", {
        ":id": this.order.id,
      });
      this.loading = false;
      window.history.back();
    },
  },
};
</script>

<style></style>
