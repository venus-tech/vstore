<template>
  <v-card flat class="pa-4">
    <v-card-text>
      <v-expansion-panels style="border: 1px solid #CCC" class="elevation-0" focusable>
        <v-expansion-panel focusable>
          <v-expansion-panel-header>
            <span>
              نوع المعاملة  (
                
            <span  class="font-weight-bold">{{type}}</span>
              )
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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
          </v-expansion-panel-content>
          <v-expansion-panel  focusable>
            <v-expansion-panel-header>
              <span>
                المتجر (

              <span class="font-weight-bold">{{$store.getters["Cart/agency"] ? $store.getters["Cart/agency"].name : ''}}</span>
                )
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <select-agency-step />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel  focusable>
            <v-expansion-panel-header>
              <span>
                الموظف (

              <span class="font-weight-bold">{{$store.getters["Cart/employee"] ? $store.getters["Cart/employee"].name : ''}}</span>
                )
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <select-employee-step />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    
    <!-- <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn color="success" x-large @click="toNext" :disabled="orderTypes.indexOf(type) < 0">
        متابعة
      </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import SelectAgencyStep from './SelectAgencyStep.vue';
import SelectEmployeeStep from './SelectEmployeeStep.vue';
export default {
  components: { SelectAgencyStep, SelectEmployeeStep },
  data: ()=>({
    type: '',
    typeErrors: [],
    orderTypes: ['توريد' , 'تصدير']
  }),
  created(){
    this.type = this.$store.getters['Cart/orderType'] ;
  },
  watch: {
    type(){
      this.$store.commit('Cart/setOrderType', this.type);
    }
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