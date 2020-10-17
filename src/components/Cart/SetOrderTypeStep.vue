<template>
  <v-card flat class="pa-4">
    <v-card-title class="pa-6">
      <v-select
        label=" نوع المعاملة "
        hint=""
        :items="orderTypes"
        v-model="type"
        outlined
        :error-messages="typeErrors"
      ></v-select>
    </v-card-title>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="toNext" :disabled="orderTypes.indexOf(type) < 0">
          متابعة
        </v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: ()=>({
    type: '',
    typeErrors: [],
    orderTypes: ['توريد' , 'تصدير']
  }),
  created(){
    this.type = this.$store.getters['Cart/orderType'] ;
  },
  methods: {
    toNext(){
      this.$store.commit('Cart/setOrderType', this.type);
      this.$emit('continue', 'GUI event')
    }
  }
}
</script>

<style>

</style>