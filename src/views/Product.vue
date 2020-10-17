<template>
  <v-card>
    <EditProduct 
      :show="showEditProductDialog"
      :product="Object.assign({},product)"
      @canceled="showEditProductDialog = false"
      @updated="updated"
    />
    <ConfirmDeletion 
      title="هل تريد ارشفة هذا المنتج"
      text="عند الارشفة سيزال هذا المنتج من قائمة المنتجات"
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      @confirmed="archive"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات المنتج
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
        <v-card>
          <v-card-title >
            {{product.name}}
            <v-spacer></v-spacer>
            # {{product.id}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            سعر الشراء : {{ product.buy_price }} جنيه
            <v-spacer></v-spacer>
            سعر البيع : {{ product.unit_price }} جنيه
            <v-spacer></v-spacer>
            الربح : {{Number(product.unit_price) - Number(product.buy_price)}} جنيه
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            وحدة القياس : {{ product.unit }}
            <v-spacer></v-spacer>
            المتوفر حاليا -n- {{ product.unit }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3>بيانات اضافية :</h3>
            {{product.description}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <span>
              التصنيف
              <v-btn route :to="`/categories/${category.id}`" class="mx-2" color="primary" outlined>
                {{category.name}}
              </v-btn>
            </span>
            <v-spacer></v-spacer>
            <v-btn large color="success" @click="showEditProductDialog = true">
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>
            <span class="mx-2"></span>
            <v-btn large color="error" @click="showConfirmDeletion = true">
              <v-icon left>mdi-archive</v-icon>
              <span>أرشفة</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="sells">
        <ProductSells :id="Number($route.params.id)" />
      </v-tab-item>
      <v-tab-item value="purchases">
        <ProductPurchaces :id="Number($route.params.id)" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import db from '../db' ;

import EditProduct from '../components/Products/EditProduct';
import ConfirmDeletion from '../components/ConfirmDeletion';

import ProductSells from '../components/Products/ProductSells' ;
import ProductPurchaces from '../components/Products/ProductPurchaces';

export default {
  components: {
    EditProduct, ConfirmDeletion,
    ProductSells,ProductPurchaces
  },
  data() {
    return {
      showEditProductDialog: false,
      showConfirmDeletion: false,
      tab: null,
      loading: false,
      product:{},
      category: {}
    };
  },
  async created(){
    await this.loadProductData();
  },
  methods: {
    async loadProductData(){
      this.loading = true;
      const DB = await db.getConnection();

      this.product = await DB.get('SELECT * FROM products WHERE id = :id' , {
        ':id': this.$route.params.id
      });

      this.category = await DB.get('SELECT * FROM categories WHERE id = :id ', {
        ":id": this.product.category_id
      });

      this.loading = false;
    },
    async updated (){
      await this.loadProductData();
      this.showEditProductDialog = false ;
    },
    async archive(){
      const DB = await db.getConnection();

      await DB.run('UPDATE products SET archived = 1 WHERE id = :id',{
        ":id": this.product.id
      });

      this.showConfirmDeletion = false;

      window.history.back();
    }
  }
};
</script>

<style>
</style>