<template>
  <v-card flat>
    <AddAgentDialog 
      :show="showAddAgentDialog" 
      @canceled="showAddAgentDialog = false" 
      @inserted="insertNew"
    />
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-btn x-large color="primary" @click="showAddAgentDialog = true">
            <v-icon left>mdi-plus</v-icon>
            <span>إضافة متجر</span>
          </v-btn>
          
          <span class="mx-2"></span>
          
        </v-col>
        <v-col md="8">
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
        <template v-slot:item.sellsValue="{ item }">
          {{ item.sellsValue }} جنيه
        </template>
        <template v-slot:item.purchasesValue="{ item }">
          {{ item.purchasesValue }} جنيه
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../db' ;

import AddAgentDialog from "../components/Agents/AddAgent";

export default {
  components: {
    AddAgentDialog
  },
  data() {
    return {
      showAddAgentDialog: false,
      search: "",
      loading:false,
      headers: [
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
      agencies: []
    };
  },
  async created(){
    await this.loadAgencies();
  },
  methods:{
    async loadAgencies(){
      this.loading = true;
      const DB = await db.getConnection();
      this.agencies = await DB.all('SELECT * FROM agencies WHERE archived = 0 ORDER BY id DESC');
      this.loading = false;
    },
    insertNew(newRow) {
      this.agencies.unshift(newRow);
      this.showAddAgentDialog = false;
    }
  }
};
</script>

<style>
</style>