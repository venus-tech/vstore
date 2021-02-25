<template>
  <v-dialog
    v-model="show"
    scrollable  
    persistent 
    max-width="960px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        تعديل بيانات الشركة
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-row>
          <v-col>
            <v-text-field 
              v-model="infos.name" 
              :error-messages="nameErrors" 
              counter="256" 
              label="اسم الشركة" 
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox 
              v-model="infos.phone_numbers" 
              counter="4" 
              label="أرقام الهاتف الثابت" 
              multiple small-chips 
              chips 
              outlined
              style="direction: ltr"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox 
              v-model="infos.mobile_numbers" 
              counter="4" 
              label="أرقام الهاتف الجوال" 
              multiple small-chips 
              chips 
              outlined
              style="direction: ltr"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox 
              v-model="infos.whatsapp_accounts" 
              counter="4" 
              label="أرقام whatsapp" 
              multiple small-chips 
              chips 
              outlined
              style="direction: ltr"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox 
              v-model="infos.locations" 
              counter="4" 
              label="المواقع الجغرافية" 
              multiple small-chips 
              chips 
              outlined
              style="direction: ltr"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="save">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean(),
      default: false
    }
  },
  data: ()=>({
    infos: {},
    nameErrors: []
  }),
  created(){
    this.loadInfos();
  },
  methods: {
    loadInfos(){
      this.infos = JSON.parse(window.localStorage.getItem('companyInformations'));
    },
    cancel(){
      this.$emit("close", "GUI canceled event");
    },
    save(){
      window.localStorage.setItem('companyInformations', JSON.stringify(this.infos));
      this.$emit("close", "GUI saved event");
    }
  }
}
</script>

<style>

</style>