<template>
  <v-card>
    <EditAgency 
      :show="showEditAgencyDialog"
      :agency="Object.assign({}, agency)"
      @updated="updated"
      @canceled="showEditAgencyDialog = false"
    />
    <ConfirmDeletion 
      title="هل تريد ارشفة بيانات هذا المتجر"
      text="عند الارشفة سيزال هذا المتجر من قائمة المتاجر"
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      @confirmed="archive"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات المتجر
      </v-tab>

      <v-tab href="#sells">
        <v-icon right>mdi-cart-arrow-up</v-icon> المبيعات
      </v-tab>

      <v-tab href="#purchases">
        <v-icon right>mdi-cart-arrow-down</v-icon> المشتريات
      </v-tab>
      
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="data">
        <v-card>
          <v-card-title >
            {{agency.name}}
            <v-spacer></v-spacer>
            # {{agency.id}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            {{agency.address}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            أرقام الهاتف
            <v-spacer></v-spacer>
            <v-chip v-for="(num, i) of agency.phone_numbers" :key="i" class="mx-2">{{num}}</v-chip>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3>اضافات</h3>
            {{agency.notes}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="success" large @click="showEditAgencyDialog = true">
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" large @click="showConfirmDeletion = true">
              <v-icon left>mdi-archive</v-icon>
              <span>ارشفة</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="sells">
        <AgentSells :id="Number($route.params.id)"/>
      </v-tab-item>
      <v-tab-item value="purchases">
        <AgentPurchaces :id="Number($route.params.id)"/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import db from '../db';

import ConfirmDeletion from '../components/ConfirmDeletion';
import EditAgency from '../components/Agents/EditAgent';
import AgentSells from '../components/Agents/AgentSells';
import AgentPurchaces from '../components/Agents/AgentPurchaces'

export default {
  components: {
    EditAgency,
    ConfirmDeletion,
    AgentSells,
    AgentPurchaces
  },
  data() {
    return {
      showConfirmDeletion: false,
      showEditAgencyDialog: false,
      tab: null,
      agency: {},
    };
  },
  
  async created(){
    await this.loadAgencyData();
  },

  methods: {
    async loadAgencyData(){
      const DB = await db.getConnection();
      this.agency = await DB.get('SELECT * FROM agencies WHERE id = :id' , {
        ":id": this.$route.params.id
      });
      this.agency.phone_numbers = this.agency.phone_numbers.split(',');
    },
    updated(newData) {
      this.showEditAgencyDialog = false;
      const newRow = Object.assign({},newData); 
      newRow.phone_numbers = newRow.phone_numbers.split(',');
      this.agency = newRow ;
    },
    async archive(){
      const DB = await db.getConnection();

      await DB.run('UPDATE agencies SET archived = 1 WHERE id = :id',{
        ":id": this.agency.id
      });

      this.showConfirmDeletion = false;

      window.history.back();
    }
  }
};
</script>

<style>
</style>