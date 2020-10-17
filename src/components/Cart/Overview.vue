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
            prefix="التخفيض :"
            outlined
            type="number"
            step="0.01"
            min="0"
            :max="total"
            v-model="discount"
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
      <v-textarea
        outlined
        v-model="notes"
        label="بيانات اضافية"
        auto-grow
        rows="5"
        counter="65000"
      ></v-textarea>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn color="success" x-large @click="goNext">
        متابعة
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: ()=>({
    discount: 0.0,
    notes: ''
  }),
  created(){
    this.discount = this.$store.getters['Cart/discount'];
    this.notes = this.$store.getters['Cart/notes'];
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
    },
    amount(){
      return this.total - this.discount ;
    }
  },
  methods: {
    goNext(){
      //alert('Printer Error: System Error code 0x0093');
      this.$store.commit('Cart/setDiscount', this.discount);
      this.$store.commit('Cart/setNotes', this.notes);

      this.$emit('continue', 'GUI event');
    }
  }
}
</script>

<style>

</style>