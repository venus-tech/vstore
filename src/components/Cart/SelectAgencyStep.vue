<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        label="اسم العميل"
        hint="اسم العميل القادم من المتجر للقيام بالعملية"
        v-model="name"
        outlined
        :error-messages="nameErrors"
      ></v-text-field>
    </v-card-text>
    <div v-if="showSelectAgency">
      <v-card-title>
        <v-row>
          <v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المتاجر" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table :loading="loading" :headers="headers" :items="agencies" :search="search">
          <template v-slot:item.name="{ item }">
            <v-btn color="primary" text router :to="`/agents/${item.id}`">
              {{item.name}}
            </v-btn>
          </template>
          <template v-slot:item.id="{item}">
            <v-btn color="primary" large class="ma-2" @click="selectAgency(item)" >
              تحديد 
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </div>
    <div v-else>
      <v-card-title >
        المتجر : {{$store.getters['Cart/agency'].name}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-title >
        العنوان : {{$store.getters['Cart/agency'].address}}
      </v-card-title>
      <v-card-text class="my-4">
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn color="info" large @click="showSelectAgency = true">
          تغير المتجر
        </v-btn>
        <!-- <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="toNext" :disabled="showSelectAgency">
          متابعة
        </v-btn> -->
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import db from '../../db';

export default {
  data: ()=>({
    name: '',
    nameErrors: [],
    showSelectAgency: true,
    agentName: '',
    agency: {},
    agencies: [],
    search: "",
    loading:false,
    headers: [
      {
        text: 'حدد' ,
        value: 'id'
      },
      {
        text: "الإسم" ,
        value: "name"
      },
      {
        text: "العنوان",
        value:"address",
        align: 'left'
      }
    ] ,
  }),
  async created(){
    this.showSelectAgency = this.$store.getters['Cart/agency'] == null ;
    this.name = this.$store.getters['Cart/agentName'];
    await this.loadAgencies();
  },
  methods: {
    async loadAgencies(){
      const DB = await db.getConnection();
      this.agencies = await DB.all('SELECT * FROM agencies WHERE archived = 0 ORDER BY id DESC');
    },
    selectAgency(agency){
      this.$store.commit('Cart/setAgency', agency);
      // const discounts = this.$store.getters['Cart/agency'].discount_table;
      // this.$store.commit('Cart/setDiscounts', discounts);
      this.showSelectAgency = false;
    },
    toNext(){
      this.$emit('continue', 'GUI event')
    }
  },
  watch: {
    name(){
      this.$store.commit('Cart/setAgentName', this.name);
    }
  }
}
</script>

<style>

</style>