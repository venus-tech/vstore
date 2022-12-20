<template>
  <v-card flat>
    
    <CartProducts v-if="!showAddProducts" @addproduct="showAddProducts = true" @continue="$emit('continue', 'GUI event')" />
    <v-card flat v-else outlined >
      <v-card-title >
        اضافة منتجات للسلة
        <v-spacer></v-spacer>
        <v-btn color="info" x-large @click="showAddProducts = false">
          معاينة المنتجات
          {{$store.getters["Cart/products"].length}}
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-title>
        <v-row>
          <v-col >
            <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table elevation-4 :headers="headers" :items="outOfCartProducts" :search="search">
          <template v-slot:item.name="{ item }">
            <v-btn router :to="`/products/${item.id}`" text color="primary" >
              {{ item.name }}
            </v-btn>
            
          </template>

          <template v-slot:item.price="{ item }">
            <strong v-if="$store.getters['Cart/orderType'] == 'تصدير'" class="green--text">{{ item.price }}ج</strong>
            <strong v-if="$store.getters['Cart/orderType'] == 'توريد'" class="green--text">{{ item.buy_price }}ج</strong>
            لكل {{ item.unit }}
          </template>

          <template v-slot:item.taxs_table="{ item }">
            {{getUnitTotalTaxes(item.taxs_table, item.price)}}
             <v-icon>mdi-currency-gbp</v-icon>
            
          </template>

          <template v-slot:item.in_store_quantity="{ item }">
            <strong :class="{'red--text' : Number(item.in_store_quantity) < 11.0}">
             {{ item.in_store_quantity }} {{ item.unit }}
            </strong>
          </template>

          <template v-slot:item.category="{ item }">
            <v-btn router :to="`/categories/${item.category_id}`" text color="primary" >
              {{ item.category }}
            </v-btn>  
          </template>
          <template v-slot:item.id="{item}">
            <v-btn 
              color="primary" 
              large 
              class="ma-2" 
              :disabled="Number(item.in_store_quantity) <= 0 && $store.getters['Cart/orderType'] == 'تصدير'"
              @click="addToCart(item)"
            >
              <v-icon left>mdi-cart-plus</v-icon>
              <span>
                إضافة
              </span>
            </v-btn>  
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script>
import db from '../../db';
import CartProducts from './CartProducts';

export default {
  components: {CartProducts},
  data:()=>({
    showAddProducts: true,
    selectedProducts: [],
    products: [],
    search: "",
    headers: [
      {
        text: "الإسم",
        value: "name"
      },
      {
        text: "الصنف",
        align: "left",
        value: "category"
      },
      {
        text: "السعر",
        value: "price"
      },
      {
        text: "الضريبة",
        value: "taxs_table"
      },
      {
        text: "المتوفر",
        value: "in_store_quantity"
      },
      {
        text: "اضافة",
        align: "left",
        value: "id"
      }
    ],
  }),
  computed: {
    outOfCartProducts(){
      const self = this;
      return this.products.filter(function(item){
        return self.$store.getters["Cart/products"].indexOf(item) < 0 ;
      });
    }
  },
  async created(){
    
    this.showAddProducts = this.$store.getters['Cart/products'].length < 1 ;
    await this.loadProducts();
  },
  methods: {
    async loadProducts(){
      const DB = await db.getConnection();
      let ids = [0];
      const length = this.$store.getters["Cart/products"].length ;
      for (let i = 0 ; i < length ; i++){
        ids.push(this.$store.getters["Cart/products"][i].id)
      }

      this.products = await DB.all(`
        SELECT 
          products.id as id,
          products.name as name,
          buy_price,
          unit_price as price,
          unit,
          category_id,
          in_store_quantity,
          taxs_table,
          (1+1) as total_price,
          (1+1) as total_taxs,
          categories.name as category,
          0 as quantity,
          0 as total_sells,
          0 as total_buys
        from products 
        join categories 
        where 
          products.category_id = categories.id
          and
          products.archived = 0
          and
          products.id NOT IN (${ids.join(',')})
      `);
    },
    addToCart(item){
      ++item.quantity ;
      this.$store.commit('Cart/addProducts' , item);
    },
    getUnitTotalTaxes(taxs_table, unit_price){
      taxs_table = JSON.parse(taxs_table);
      let sum = 0;
      let amount = 0;
      for (let item of taxs_table){
        amount = Number(item.value);
        if (item.type == "percent"){
          amount = amount / 100;
          amount = amount * Number(unit_price);
        }
        sum += amount;
      }
      return sum;
    },
  }
}
</script>

<style>

</style>