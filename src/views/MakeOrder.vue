<template>
  <v-card outlined>
    <ConfirmReset 
      :show='showConfirmReset'
      @canceled='showConfirmReset = false'
      @confirmed='resetCart'
      title="هل فعلا تريد الغاء الطلبية"
      text="هذا الاجراء سيؤدي الى تفريغ جميع بيانات سلة المبيعات"
    />
    <v-card-text>
      <v-stepper v-model="step" :alt-labels="true" :editable="true">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">
            <v-btn @click="step = 1" 
              :disabled="step < 1" 
              :outlined="step == 1" 
              rounded 
              :color="step > 1 ? 'primary' : ''"
            >
              نوع المعاملة
            </v-btn>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2">
            <v-btn @click="step = 2" 
              :disabled="step < 2" 
              :outlined="step == 2" 
              rounded 
              :color="step > 2 ? 'primary' : ''"
            >
              المتجر
            </v-btn>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 3" step="3">
            <v-btn @click="step = 3" 
              :disabled="step < 3" 
              :outlined="step == 3" 
              rounded 
              :color="step > 3 ? 'primary' : ''"
            >
              العميل
            </v-btn>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 4" step="4">
             <v-btn @click="step = 4" 
              :disabled="step < 4" 
              :outlined="step == 4" 
              rounded 
              :color="step > 4 ? 'primary' : ''"
            >
              المنتجات
            </v-btn>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 5" step="5">
             <v-btn @click="step = 5" 
              :disabled="step < 5" 
              :outlined="step == 5" 
              rounded 
              :color="step > 5 ? 'primary' : ''"
            >
              المندوب
            </v-btn>
          </v-stepper-step>

          <v-divider></v-divider>
          <v-stepper-step :complete="step > 6" step="6">
             <v-btn @click="step = 6" 
              :disabled="step < 6" 
              :outlined="step == 6" 
              rounded 
              :color="step > 6 ? 'primary' : ''"
            >
              ملاحظات
            </v-btn>
          </v-stepper-step>
          
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 7" step="7">
             <v-btn @click="step = 7" 
              :disabled="step < 7" 
              :outlined="step == 7" 
              rounded 
              :color="step > 7 ? 'primary' : ''"
            >
              الحفظ
            </v-btn>
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <SetOrderType @continue="step = 2" />
          </v-stepper-content>
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-content step="2">
            <SelectAgencyStep @continue="step = 3" />
          </v-stepper-content>
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-content step="3">
            <SetAgentName @continue="step = 4" />
          </v-stepper-content>
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-content step="4">
            <SelectProduct @continue="step = 5" />
          </v-stepper-content>
        </v-stepper-items>
        <v-stepper-items>
          <v-stepper-content step="5">
            <SelectEmplyee @continue="step = 6" />
          </v-stepper-content>
        </v-stepper-items>
        
        <v-stepper-items>
          <v-stepper-content step="6">
            <Overview @continue="step = 7;" />
          </v-stepper-content>
          <v-stepper-content step="7">
            <SavePrint @continue="step = 8;saveOrder()" @saveProformaInvoice="saveProformaInvoice" />
          </v-stepper-content> 
        </v-stepper-items>
      </v-stepper>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-3">
      <v-spacer></v-spacer>
      <v-btn @click="showConfirmReset = true" color="error" large class="mx-2">
        <v-icon>mdi-delete</v-icon>
        <span>تفريغ السلة</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import db from '../db' ;

import SelectAgencyStep from '../components/Cart/SelectAgencyStep' ;
import SetAgentName from '../components/Cart/SetAgentNameStep';
import SetOrderType from '../components/Cart/SetOrderTypeStep';
import SelectProduct from '../components/Cart/SelectProducts';
import SelectEmplyee from '../components/Cart/SelectEmployeeStep';
import Overview from '../components/Cart/Overview';
import SavePrint from '../components/Cart/SavePrint';

import ConfirmReset from '../components/ConfirmDeletion';

export default {
  components: {
    SelectAgencyStep, SetAgentName, SetOrderType,
    SelectProduct, SelectEmplyee, Overview, SavePrint,
    ConfirmReset
  },
  data: ()=>({
    showConfirmReset: false,
    step: 1,
    agencies: [],
    employees: [],
    agentName: '',
    orderType: null,
    products: [],
    agency: null,
    employee: null,
  }),
  async created(){
    this.step = this.$store.getters['Cart/currentStep'];
  },
  watch: {
    step(){
      this.$store.commit('Cart/setCurrentStep', this.step);
    }
  },
  computed:{
    total(){
      let sum = 0 ;
      if(this.$store.getters['Cart/orderType'] == 'تصدير'){
        for(let i = 0 ; i < this.$store.getters['Cart/products'].length; i++){
          sum += 
            Number(this.$store.getters['Cart/products'][i].price)
            * 
            Number(this.$store.getters['Cart/products'][i].quantity)
          ;
        }
      }
      if(this.$store.getters['Cart/orderType'] == 'توريد'){
        for(let i = 0 ; i < this.$store.getters['Cart/products'].length; i++){
          sum += 
            Number(this.$store.getters['Cart/products'][i].buy_price)
            * 
            Number(this.$store.getters['Cart/products'][i].quantity)
          ;
        }
      }
      return sum;
    }
  },
  methods: {
    async saveOrder(){
      const DB = await db.getConnection();

      // TODO: save order
      // TODO: save order products

      const addOrderSQL = `
        INSERT INTO orders 
        (date, agency_id, total_bill, discount, agent_name, type, notes, employee_id)
        VALUES
        (datetime('now', 'localtime'), :agency_id, :total_bill, :discount, :agent_name, :type, :notes, :employee_id)
      `;

      const orderData = {
        ":agency_id": this.$store.getters['Cart/agency'].id,
        ":total_bill": this.total,
        ":discount": this.$store.getters['Cart/discount'],
        ":agent_name": this.$store.getters['Cart/agentName'],
        ":type": this.$store.getters['Cart/orderType'],
        ":notes": this.$store.getters['Cart/notes'],
        ":employee_id": this.$store.getters['Cart/employee'].id
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
      }

      const updateInStoreQuantitySQL = `
        UPDATE products 
        SET in_store_quantity = in_store_quantity + :newQantity 
        WHERE id = :id
      `;

      let updateInStoreQuantityData = {
        ":newQantity": 0.0,
        ":id": 0
      };

      let newQantity = 0.0 ;

      for(let i = 0 ; i < this.$store.getters['Cart/products'].length; i++){
        productsData[":product_id"] = this.$store.getters['Cart/products'][i].id ;
        productsData[":quantity"] = this.$store.getters['Cart/products'][i].quantity ;
        productsData[":price"] = this.$store.getters['Cart/products'][i].price ;
        productsData[":buy_price"] = this.$store.getters['Cart/products'][i].buy_price ;

        await DB.run(addProductsSQL, productsData);

        updateInStoreQuantityData[":id"] = this.$store.getters['Cart/products'][i].id ;

        newQantity = Math.abs(Number(this.$store.getters['Cart/products'][i].quantity));
        if(this.$store.getters['Cart/orderType'] == 'تصدير'){
          newQantity = -1 * newQantity ;
        }
        updateInStoreQuantityData[":newQantity"] = newQantity ;

        await DB.run(updateInStoreQuantitySQL, updateInStoreQuantityData);
      }

      this.step = 1;
      try {
        this.$store.commit('Cart/resetCart'); 
        this.$router.push('/orders/'+orderId)
        this.$emit('inserted', orderId); 
      } catch (error) {
        console.error(error)
      }
      
    },
    resetCart(){
      this.step = 1;
      try {
        this.$store.commit('Cart/resetCart');  
      } catch (error) {
        console.error(error)
      }
      window.history.back();
      this.showConfirmReset = false;
    },
    async saveProformaInvoice(){
      const DB = await db.getConnection();

      const addCartSQL = `
        INSERT INTO proforma_invoice (data) VALUES (:data)
      `;

      const cartData = this.$store.getters['Cart/export'];
      
      const response = await DB.run(addCartSQL, cartData);

      console.log(response);
    }
  }
}
</script>

<style>

</style>