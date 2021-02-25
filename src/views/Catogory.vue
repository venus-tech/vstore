<template>
  <v-card>
    <ConfirmDeletion 
      :show="showDeletionDialog" 
      @canceled="showDeletionDialog = false" 
      @confirmed="deletCategory" 
      :title="` هل تريد ازالة التصنيف ${name} `"
      text="سيتم حذف هذا التصنيف نهائيا"
    />
    <EditCategory 
      :category="getCategoryData()" 
      :show="showEditCatogoryDialog" 
      @updated="updated" 
      @canceled="showEditCatogoryDialog = false" 
    />
    <AddProductDialog 
      :category="Number(id)"
      :show="showAddProductDialog" 
      @canceled="showAddProductDialog = false"
      @inserted="addProduct"
    />
    <!--
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات الصنف
      </v-tab>

      <v-tab href="#products">
        <v-icon right>mdi-barcode</v-icon> المنتجات {{products.length}}
      </v-tab>
    </v-tabs>-->

    <!--<v-tabs-items v-model="tab">
      <v-tab-item value="data">-->
        <v-card outlined>
          
          <v-card-title >
            {{name}}
            <v-spacer></v-spacer>
            # {{id}} 
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="description && description.length">
            {{ description }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="success" x-large @click="showEditCatogoryDialog = true">
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" x-large @click="showDeletionDialog = true" :disabled="products.length > 0">
              <v-icon left>mdi-delete</v-icon>
              <span v-if="products.length < 1">
                حذف
              </span>
              <span v-else>
                لا يمكن الحذف لان هناك منتجات لهذا التصنيف
              </span>
            </v-btn>
          </v-card-actions>
        </v-card>
      <!--</v-tab-item>
      <v-tab-item value="products" class="pa-4">-->
        <v-card class="pa-4">
          <v-row>
            <v-col>
              <strong class="headline">
                المنتجات
              </strong>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-btn x-large color="primary" @click="showAddProductDialog = true">
                <v-icon left>mdi-plus-box</v-icon>
                <span>إضافة منتج</span>
              </v-btn>
            </v-col>
            <v-col md="6">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
            </v-col>
          </v-row>
          <div class="my-4"></div>
          <v-data-table :headers="headers" :items="products" :search="search">
            <template v-slot:item.name="{ item }">
              <v-btn router :to="`/products/${item.id}`" text color="primary" >
                {{ item.name }}
              </v-btn>
              
            </template>
            <template v-slot:item.in_store_quantity="{ item }">
              <strong :class="{'red--text' : Number(item.in_store_quantity) <= 10.0 }">
                {{ item.in_store_quantity + ' ' + item.unit }}
              </strong>
            </template>
            <template v-slot:item.unit_price="{ item }">
              <strong>{{ item.unit_price }} ج</strong>
            </template>
            <template v-slot:item.buy_price="{ item }">
              <strong>{{ item.buy_price }} ج</strong>
            </template>
            <template v-slot:item.profit="{ item }">
              <strong class="green--text">{{ item.profit }} ج</strong>
            </template>
          </v-data-table>
        </v-card>
      <!--</v-tab-item>
    </v-tabs-items>-->
  </v-card>
</template>

<script>
import db from '../db' ;
import EditCategory from '../components/Products/EditCategory'
import ConfirmDeletion from '../components/ConfirmDeletion'
import AddProductDialog from "../components/Products/AddProduct";

export default {
  components: {EditCategory, ConfirmDeletion, AddProductDialog} ,
  data() {
    return {
      showEditCatogoryDialog: false,
      showDeletionDialog: false,
      showAddProductDialog: false,
      tab: null,
      id: null,
      name: null,
      description: null,
      search: "",
      headers: [
        {
          text: "الإسم",
          value: "name"
        },
        {
          text: "الوحدة",
          value: "unit"
        },
        {
          text: "المتوفر", 
          value: "in_store_quantity"
        },
        {
          text: "سعر البيع",
          value: "unit_price"
        },
        {
          text: "سعر الشراء",
          value: "buy_price"
        },
        {
          text: "الربح",
          align: "left",
          value: "profit"
        }
      ],
      products: []
    };
  },
  async created(){
    await this.loadCategoryData();
  },
  methods:{
    getCategoryData(){
      return {
        id: this.id,
        name: this.name,
        description: this.description
      };
    },
    async loadCategoryData(){
      const DB = await db.getConnection();

      const category = await DB.get('SELECT * FROM categories WHERE id = :id' , {
        ":id": this.$route.params.id
      });

      this.id = category.id ;
      this.name = category.name ;
      this.description = category.description ;

      this.products = await DB.all(`
        SELECT 
          id, name, unit, unit_price, buy_price, in_store_quantity, (unit_price - buy_price) as profit
        FROM products 
        WHERE 
          category_id = ${this.id} and archived = 0 
        ORDER BY id DESC
      `) ;
    },
    updated(newData){
      this.showEditCatogoryDialog = false;
      this.name = newData.name;
      this.description = newData.description;
    },
    async deletCategory(){
      const DB = await db.getConnection();
      await DB.run('DELETE FROM categories WHERE id = :id', {':id': this.id});
      this.$router.push('/products')
    },
    addProduct(newRow){
      this.showAddProductDialog = false
      this.products.unshift(newRow)
    }
  }

};
</script>

<style>
</style>