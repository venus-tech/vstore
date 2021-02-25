<template>
  <v-card flat class="pa-4">
    <v-card-title class="pa-6">
      <v-text-field
        label="اسم العميل"
        hint="اسم العميل القادم من المتجر للقيام بالعملية"
        v-model="name"
        outlined
        :error-messages="nameErrors"
      ></v-text-field>
    </v-card-title>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="toNext">
          متابعة
        </v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: ()=>({
    name: '',
    nameErrors: []
  }),
  created(){
    this.name = this.$store.getters['Cart/agentName'] ;
  },
  methods: {
    toNext(){
      /*if(this.name.trim().length < 3 && this.$store.getters['Cart/orderType'] == 'تصدير'){
        this.nameErrors.push('يجب ان يحتوي الاسم على 3 احرف على الاقل');
        return false;
      }*/
      this.$store.commit('Cart/setAgentName', this.name);
      this.$emit('continue', 'GUI event')
    }
  }
}
</script>

<style>

</style>