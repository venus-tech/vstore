<template>
  <v-card flat>
    <companyInformationsEditor 
      :show="showComponyInformationsEditor"
      @close="colseComponyInformationsEditor"
    />
    <v-card-title >
      بيانات الشركة
      <v-spacer></v-spacer>
      <v-btn color="success" x-large @click="showComponyInformationsEditor = true">
        <v-icon>mdi-pencil</v-icon>
        <span>تعديل</span>
      </v-btn>
    </v-card-title>
    <v-card-text >
      <v-card outlined>
        <v-card-title >
          اسم الشركة
          <v-spacer></v-spacer>
          {{infos.name}}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title >
          أرقام الهاتف الثابت
          <v-spacer></v-spacer>
          <v-chip v-for="num of infos.phone_numbers" :key="num" class="mx-1" dark  style="direction: ltr" >
            {{num}}
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title >
          أرقام الهاتف السيار
          <v-spacer></v-spacer>
          <v-chip v-for="num of infos.mobile_numbers" :key="num" class="mx-1" dark  style="direction: ltr">
            {{num}}
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title >
          أرقام whatsapp
          <v-spacer></v-spacer>
          <v-chip v-for="num of infos.whatsapp_accounts" :key="num" class="mx-1" dark style="direction: ltr">
            {{num}}
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text >
          <h3> المواقع الجغرافية للشركة </h3>
          <br>
          <v-chip v-for="num of infos.locations" :key="num" class="mx-1" dark>
            {{num}}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import companyInformationsEditor from './EditCompanyInformations';

export default {
  components: {companyInformationsEditor},
  data: ()=>({
    showComponyInformationsEditor: false,
    infos: {}
  }),
  created(){
    this.loadInfos();
  },
  methods: {
    loadInfos(){
      this.infos = JSON.parse(window.localStorage.getItem('companyInformations'));
    },
    colseComponyInformationsEditor(){
      this.loadInfos();
      this.showComponyInformationsEditor = false;
    }
  }
}
</script>

<style>

</style>