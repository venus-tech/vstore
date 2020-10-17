<template>
  <div class="print-zone pa-4">
    <v-card flat class="print-page-options">
      <v-card-title>
        <v-btn color="info" x-large  rounded @click="print">
          <v-icon left>mdi-printer</v-icon>
          <span>طباعة</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
    <h2 style="text-align:center">
      شركة أولاد عثمان
      <br>
      For Cosmetics supplement medical, Perfumes & Baby supplies
    </h2>
    <br>
    <h2 style="text-align:center">
      فاتورة طلبية - {{$store.getters['Cart/orderType']}}
    </h2>
    <br>
    <v-card flat>
      <v-card-title>
        المبلغ الكلي : {{total }} جنيه
        <v-spacer></v-spacer>
        التخفيض : {{Number($store.getters['Cart/discount'])}} جنيه
        <v-spacer></v-spacer>
        المبلغ المطلوب : {{Number(total) - Number($store.getters['Cart/discount'])}} جنيه
      </v-card-title>
    </v-card>
    <br>
    <table cellspacing="0" border="1" width="100%">
      <thead style="background-color: #CCC">
        <th class="pa-2">#</th>
        <th class="pa-2">المنتج</th>
        <th class="pa-2">الكمية</th>
        <th class="pa-2">سعر الوحدة</th>
        <th class="pa-2" style="text-align:left">السعر الكلي</th>
      </thead>
      <tbody>
        <tr v-for="(product, index) of $store.getters['Cart/products']" :key="product.id">
          <td class="pa-2">{{index+1}}</td>
          <td class="pa-3">{{product.name}}</td>
          <td class="pa-3">{{product.quantity}} {{product.unit}}</td>
          <td class="pa-3"><strong>{{product.price}} جنيه</strong></td>
          <td class="pa-3" style="text-align:left"><strong>{{product.price * product.quantity}} جنيه</strong></td>
        </tr>
      </tbody>
    </table>

    <br>
    <h3 class="pa-3">
      ارقام الهاتف : 0910003603, 0123369422
    </h3>
    <hr>
    <h3 class="pa-3">
      الثابت : 0155133303
    </h3>
    <hr>
    <h3 class="pa-3">
       whatsapp : 0910003603, 0923394011, 0128534861
    </h3>
    <hr>
    <h3 class="pa-3">
      الموقع : سوق امدرمان - عمارة بابكر الرفاعي - جوار عمارة البرير
    </h3>
  </div>
</template>

<script>
export default {
  methods: {
    goBack(){
      window.history.back();
    },
    print(){
      window.print();
    }
  },
  computed: {
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
  }
}
</script>

<style>
  @media print {
    .print-page-options {
      display: none;
    }
  }
  .print-zone{
    background-color: white !important;
  }
</style>