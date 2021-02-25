<template>
  <v-card>
    <EditProduct
      :show="showEditProductDialog"
      :product="Object.assign({}, product)"
      @canceled="showEditProductDialog = false"
      @updated="updated"
      :step="Number(step)"
    />
    <ConfirmDeletion
      title="هل تريد ارشفة هذا المنتج"
      text="عند الارشفة سيزال هذا المنتج من قائمة المنتجات"
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      @confirmed="archive"
    />

    <v-card-title>
      {{ product.name }}
      <v-spacer></v-spacer>
      # {{ product.id }}
    </v-card-title>
    <v-divider></v-divider>

    <v-card-title>
      مجموع التكلفة : {{ product.buy_price }} جنيه
      <v-spacer></v-spacer>
      سعر البيع : {{ product.unit_price }} جنيه
      <v-spacer></v-spacer>
      الربح :
      {{ Number(product.unit_price) - Number(product.buy_price) }} جنيه
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title>
      وحدة القياس : {{ product.unit }}
      <v-spacer></v-spacer>
      <span
        :class="{
          'red--text': Number(product.in_store_quantity) <= 10.0,
        }"
      >
        المتوفر {{ product.in_store_quantity }} {{ product.unit }}
      </span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h3>بيانات اضافية :</h3>
      {{ product.description }}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <span>
        التصنيف
        <v-btn
          route
          :to="`/categories/${category.id}`"
          class="mx-2"
          color="primary"
          outlined
        >
          {{ category.name }}
        </v-btn>
      </span>
      <v-spacer></v-spacer>
      <v-btn
        large
        color="success"
        @click="
          step = 1;
          showEditProductDialog = true;
        "
      >
        <v-icon left>mdi-pencil</v-icon>
        <span>تعديل</span>
      </v-btn>
      <span class="mx-2"></span>
      <v-btn large color="error" @click="showConfirmDeletion = true">
        <v-icon left>mdi-archive</v-icon>
        <span>أرشفة</span>
      </v-btn>
    </v-card-actions>
    <v-card-text class="pa-0">
      <v-tabs v-model="tab" :grow="true" dark>
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <!--<v-tab href="#data">
          <v-icon right>mdi-file-outline</v-icon> بيانات المنتج
        </v-tab>-->

        <v-tab href="#costs">
          <v-icon right>mdi-currency-usd</v-icon> هيكل التكاليف
        </v-tab>

        <v-tab href="#specifications">
          <v-icon right>mdi-playlist-check</v-icon> جدول المواصفات
        </v-tab>

        <v-tab href="#taxs">
          <v-icon right>mdi-currency-gbp</v-icon> هيكل الضرائب
        </v-tab>

        <v-tab href="#sells">
          <v-icon right>mdi-cart-arrow-up</v-icon> المبيعات
        </v-tab>

        <v-tab href="#purchases">
          <v-icon right>mdi-cart-arrow-down</v-icon> المشتريات
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="data"></v-tab-item>
        <v-tab-item value="specifications">
          <v-card>
            <v-card-title>
              

              <v-btn
                large
                color="success"
                outlined
                @click="
                  step = 3;
                  showEditProductDialog = true;
                "
              >
                <v-icon left>mdi-pencil</v-icon>
                <span>تعديل</span>
              </v-btn>
            </v-card-title>
            <v-card-text class="">
              <ProductSpecificationTable :product="product" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="costs">
          <v-card>
            <v-card-title>
              

              <v-btn
                large
                color="success"
                outlined
                @click="
                  step = 2;
                  showEditProductDialog = true;
                "
              >
                <v-icon left>mdi-pencil</v-icon>
                <span>تعديل</span>
              </v-btn>
            </v-card-title>
            <v-card-text class="">
              <ProductCostsTable :product="product" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="taxs">
          <v-card>
            <v-card-title>
              

              <v-btn
                large
                color="success"
                outlined
                @click="
                  step = 4;
                  showEditProductDialog = true;
                "
              >
                <v-icon left>mdi-pencil</v-icon>
                <span>تعديل</span>
              </v-btn>
            </v-card-title>
            <v-card-text class="">
              <ProductTaxsTable :product="product" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="sells">
          <ProductSells :id="Number($route.params.id)" />
        </v-tab-item>
        <v-tab-item value="purchases">
          <ProductPurchaces :id="Number($route.params.id)" />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import db from "../db";

import EditProduct from "../components/Products/nEditProduct";
import ConfirmDeletion from "../components/ConfirmDeletion";

import ProductSpecificationTable from "../components/Products/ProductSpecificationTable";
import ProductCostsTable from "../components/Products/ProductExpensesTable";
import ProductTaxsTable from "../components/Products/ProductTaxsTable";
import ProductSells from "../components/Products/ProductSells";
import ProductPurchaces from "../components/Products/ProductPurchaces";

export default {
  components: {
    EditProduct,
    ConfirmDeletion,
    ProductSells,
    ProductPurchaces,
    ProductSpecificationTable,
    ProductCostsTable,
    ProductTaxsTable,
  },
  data() {
    return {
      showEditProductDialog: false,
      showConfirmDeletion: false,
      step: 1,
      tab: null,
      loading: false,
      product: {
        specs_table: [],
        taxs_table: [],
        costs_table: [],
      },
      category: {},
    };
  },
  async created() {
    await this.loadProductData();
  },
  methods: {
    async loadProductData() {
      this.loading = true;
      const DB = await db.getConnection();

      const response = await DB.get("SELECT * FROM products WHERE id = :id", {
        ":id": this.$route.params.id,
      });

      this.category = await DB.get("SELECT * FROM categories WHERE id = :id ", {
        ":id": response.category_id,
      });

      response.specs_table = JSON.parse(response.specs_table);
      response.costs_table = JSON.parse(response.costs_table);
      response.taxs_table = JSON.parse(response.taxs_table);

      this.product = response;

      this.loading = false;
    },
    async updated() {
      await this.loadProductData();
      this.showEditProductDialog = false;
    },
    async archive() {
      const DB = await db.getConnection();

      await DB.run("UPDATE products SET archived = 1 WHERE id = :id", {
        ":id": this.product.id,
      });

      this.showConfirmDeletion = false;

      window.history.back();
    },
  },
};
</script>

<style>
</style>